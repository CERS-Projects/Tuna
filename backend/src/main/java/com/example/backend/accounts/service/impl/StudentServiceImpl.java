package com.example.backend.accounts.service.impl;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectReader;
import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.example.backend.accounts.dto.ModifyStudentAccountRequest;
import com.example.backend.accounts.dto.ReadCSVFileStudentCreateRequest;
import com.example.backend.accounts.dto.StudentCreateRequest;
import com.example.backend.accounts.dto.StudentInformationResponse;
import com.example.backend.accounts.helper.AccountsHelper;
import com.example.backend.accounts.model.StudentEntity;
import com.example.backend.accounts.model.UserEntity;
import com.example.backend.accounts.repository.StudentRepository;
import com.example.backend.accounts.repository.UserRepository;
import com.example.backend.accounts.service.StudentService;
import com.example.backend.exception.model.SchoolNotFoundException;
import com.example.backend.group.dto.GetUserBySchoolIdRequest;
import com.example.backend.group.dto.GetUserResponse;
import com.example.backend.group.model.GroupEntity;
import com.example.backend.group.repository.GroupMemberRepository;
import com.example.backend.group.repository.GroupRepository;
import com.example.backend.group.service.GroupMemberService;
import com.example.backend.school.model.SchoolEntity;

@Service
public class StudentServiceImpl implements StudentService {

    private final GroupRepository groupRepository;

    private final GroupMemberRepository groupMemberRepository;

    /* StudentRepository の依存性注入 */
    private final StudentRepository studentRepository;

    /* UserRepository の依存性注入 */
    private final UserRepository userRepository;

    /* Helperクラス の依存性注入 */
    private final AccountsHelper accountsHelper;

    /* CSVファイルの読み取りとそのデータをJavaで扱えるようにデシリアライズするもの */
    private final ObjectReader csvObjectReader;

    private final GroupMemberService groupMemberService;

    /* 生徒アカウントをレコードとして関連つけている */
    private record StudentAccountPair(UserEntity newUserAccount, StudentEntity newStudentAccount) {
    }

    /* CSVファイル扱えるようにするための初期設定 */
    public StudentServiceImpl(UserRepository userRepository, StudentRepository studentRepository,
            AccountsHelper accountsHelper, GroupMemberService groupMemberService, GroupRepository groupRepository,
            GroupMemberRepository groupMemberRepository) {
        /* 依存の注入 */
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.accountsHelper = accountsHelper;
        this.groupMemberService = groupMemberService;
        this.groupRepository = groupRepository;
        this.groupMemberRepository = groupMemberRepository;

        /* CSVマッパーを使用できるようにするための処理 */
        CsvMapper csvMapper = new CsvMapper();
        /* 引数をcsvMapperで使用できるようにするための設定 */
        csvMapper.registerModule(new JavaTimeModule());

        /*
         * CSVファイル読み取りのルール設定
         * schemaFor():CSVファイルからPOJOにマッピングするためのファイルを指定
         * withHeader():CSVファイルの1行目をヘッダーとして扱う
         * withColumnReordering(true):ヘッダーの順番が入れ替わっていても対応できるようにする
         */
        CsvSchema csvSchema = csvMapper.schemaFor(ReadCSVFileStudentCreateRequest.class)
                .withHeader()
                .withColumnReordering(true);

        /*
         * デシリアライズしたデータを読み取り専用にする処理
         */
        this.csvObjectReader = csvMapper.readerFor(ReadCSVFileStudentCreateRequest.class)
                .with(csvSchema);
    }

    /* ユーザデータの基本情報を登録（生徒） */
    @Override
    @Transactional
    public List<UserEntity> createStudent(List<StudentCreateRequest> dto, Integer schoolId) {

        SchoolEntity schoolEntity = accountsHelper.findSchoolEntityById(schoolId);

        List<UserEntity> newStudentAccounts = dto
                .stream()
                .map(newStudent -> {
                    UserEntity newStudentAccount = accountsHelper.toUserEntity(schoolEntity,
                            newStudent.getShowUserId(),
                            newStudent.getPassword(),
                            newStudent.getMailAddress(),
                            newStudent.getName());
                    return newStudentAccount;
                })
                .collect(Collectors.toList());

        List<UserEntity> savedUserEntities = userRepository.saveAll(newStudentAccounts);
        return savedUserEntities;
    }

    @Override
    @Transactional
    public void deleteStudent(Integer userId, Integer schoolId) {
        Boolean isExistsStudent = studentRepository.existsBySchoolIdAndUserId(schoolId, userId);

        if (isExistsStudent) {
            groupMemberRepository.deleteAllByUserId(userId);

            studentRepository.deleteById(userId);

            userRepository.deleteById(userId);
        }
    }

    /* 登録した基本情報のユーザIDを元に、生徒情報を付加する */
    @Override
    @Transactional
    public void setStudentEnrollmentInformation(List<StudentCreateRequest> dto, List<UserEntity> savedStudentAccounts) {

        if (dto.size() != savedStudentAccounts.size()) {
            throw new IllegalArgumentException("DTOのサイズと保存された生徒アカウントのサイズが一致しません。");
        }

        List<StudentEntity> studentEntities = IntStream.range(0, savedStudentAccounts.size())
                .mapToObj(index -> {
                    UserEntity savedStudentAccount = savedStudentAccounts.get(index);
                    StudentCreateRequest request = dto.get(index);
                    return toStudentEntity(
                            savedStudentAccount,
                            request.getGrade(),
                            request.getAdmissionDate(),
                            request.getGraduateDate());
                })
                .collect(Collectors.toList());
        studentRepository.saveAll(studentEntities);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentInformationResponse findOneStudentInformationResponse(final Integer studentId) {
        StudentInformationResponse response = studentRepository.findOneStudentInformation(studentId);
        if (response == null) {
            throw new SchoolNotFoundException("指定した学校が見つかりません");
        }
        return response;
    }

    /*
     * CSVファイルから一括で生徒アカウントを登録する機能
     * InputStream inputStream = csvFile.getInputStream():
     * アップロードされたCSVファイルの内容を読み取るためのストリーム
     * (ストリームとは入力->整形->出力までの一連の流れを指す)
     * this.readCsv(inputStream):
     * CSVファイルの内容をReadCSVFileStudentCreateRequestオブジェクトのリストに変換
     * records.stream(): recordsとして取得したリストをストリームとして処理を始める
     * .map(eachElement->this.toStudentEntityByFile(eachElement, schoolId)):
     * 各レコードをStudentAccountPairオブジェクトに変換
     * .collect(Collectors.toList()): toStudentEntityByFileで変換した結果をList<?>に集約
     * StudentAccountPair::newUserAccount:
     * StudentAccountPairオブジェクトから新しいUserEntityオブジェクトを取得
     * StudentAccountPair::newStudentAccount:
     * StudentAccountPairオブジェクトから新しいStudentEntityオブジェクトを取得
     * try-with-resources構文: InputStreamを自動的に閉じるための構文
     */
    @Override
    @Transactional
    public void createStudentByFile(MultipartFile csvFile, final Integer schoolId) throws IOException {
        try (InputStream inputStream = csvFile.getInputStream()) {
            List<ReadCSVFileStudentCreateRequest> records = this.readCsv(inputStream);
            List<StudentAccountPair> fromCsvData = records.stream()
                    .map(recordEachElement -> this.toStudentEntityByFile(recordEachElement, schoolId))
                    .collect(Collectors.toList());

            List<UserEntity> toUserData = fromCsvData.stream()
                    .map(StudentAccountPair::newUserAccount)
                    .collect(Collectors.toList());

            List<StudentEntity> toStudentData = fromCsvData.stream()
                    .map(StudentAccountPair::newStudentAccount)
                    .collect(Collectors.toList());

            userRepository.saveAll(toUserData);
            studentRepository.saveAll(toStudentData);
        }
    }

    /*
     * フロントに返す用の値を取得、加工するメソッド
     * 以下の値を取得し、Dtoにセットする
     * showUserId:表示用ユーザID
     * name:ユーザ名
     * grade:学年
     * isJoin:グループに所属しているかどうか
     */
    @Override
    @Transactional(readOnly = true)
    public List<GetUserResponse> findAllGroups(Integer schoolId, GetUserBySchoolIdRequest dto) {

        if (dto.getGroupId() != 0) {
            GroupEntity groupEntity = groupRepository.findById(dto.getGroupId())
                    .orElseThrow(() -> new EmptyResultDataAccessException("グループが見つかりません", 0));

            Integer getSchoolId = groupEntity.getSchool().getSchoolId();

            if (!getSchoolId.equals(schoolId)) {
                throw new IllegalArgumentException("不正なリクエストです");
            }
        }

        List<GetUserResponse> response = studentRepository.findAllStudentUsers(schoolId);

        if (dto.getGroupId() == 0) {
            return response.stream()
                    .peek(user -> user.setIsJoin(Boolean.FALSE))
                    .collect(Collectors.toList());
        }

        Set<Integer> members = groupMemberService.findJoinUserIdsByGroupId(dto.getGroupId());
        return response.stream()
                .peek(user -> {
                    Boolean isJoined = members.contains(user.getUserId());
                    user.setIsJoin(isJoined);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentInformationResponse> findStudentInformationResponses(Integer schoolId) {
        List<StudentInformationResponse> responses = studentRepository.findAllStudentInformation(schoolId);
        return responses;
    }

    @Override
    @Transactional
    public void modifyStudentAccount(ModifyStudentAccountRequest dto) {
        userRepository.modifyBasicInformationByUserId(
                dto.getUserId(),
                dto.getName(),
                dto.getMailAddress(),
                dto.getAccountStopFlag());
        studentRepository.modifyStudentAccountByUserId(
                dto.getUserId(),
                dto.getGraduateDate());
    }

    /*
     * UserEntity->StudentEntityに変換するヘルプメソッド
     */
    private StudentEntity toStudentEntity(UserEntity studentAccount, Integer grade,
            LocalDate admissionDate, LocalDate graduateDate) {
        StudentEntity studentEnrollmentInformation = new StudentEntity();

        studentEnrollmentInformation.setUser(studentAccount);
        studentEnrollmentInformation.setGrade(grade);
        studentEnrollmentInformation.setAdmissionDate(admissionDate);

        if (graduateDate != null) {
            studentEnrollmentInformation.setGraduateDate(graduateDate);
        }

        return studentEnrollmentInformation;
    }

    /* CSVファイルの要素をPOJOに変換 */
    private List<ReadCSVFileStudentCreateRequest> readCsv(InputStream inputStream) throws IOException {
        return csvObjectReader.<ReadCSVFileStudentCreateRequest>readValues(inputStream).readAll();
    }

    /* エンティティに挿入する処理 */
    private StudentAccountPair toStudentEntityByFile(ReadCSVFileStudentCreateRequest records, final Integer schoolId) {

        SchoolEntity schoolEntity = accountsHelper.findSchoolEntityById(schoolId);
        UserEntity newUserAccount = accountsHelper.toUserEntity(schoolEntity,
                records.showUserId(),
                records.password(),
                records.mailAddress(),
                records.name());

        StudentEntity newStudentAccount = toStudentEntity(newUserAccount,
                records.grade(),
                records.admissionDate(),
                records.graduateDate());

        return new StudentAccountPair(newUserAccount, newStudentAccount);
    }
}
