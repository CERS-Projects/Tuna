package com.example.backend.accounts.service.impl;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.accounts.dto.ReadCSVFileStudentCreateRequest;
import com.example.backend.accounts.dto.StudentCreateRequest;
import com.example.backend.accounts.helper.AccountsHelper;
import com.example.backend.accounts.model.StudentEntity;
import com.example.backend.accounts.model.UserEntity;
import com.example.backend.accounts.repository.StudentRepository;
import com.example.backend.accounts.repository.UserRepository;
import com.example.backend.accounts.service.StudentService;
import com.fasterxml.jackson.databind.ObjectReader;
import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@Service
public class StudentServiceImpl implements StudentService{

    /* StudentRepository の依存性注入 */
    private final StudentRepository studentRepository;

    /* UserRepository の依存性注入 */
    private final UserRepository userRepository;

    /* Helperクラス の依存性注入 */
    private final AccountsHelper accountsHelper;

    /* CSVファイルの読み取りとそのデータをJavaで扱えるようにデシリアライズするもの */
    private final ObjectReader csvObjectReader;

    /* 生徒アカウントをレコードとして関連つけている */
    private record StudentAccountPair(UserEntity newUserAccount, StudentEntity newStudentAccount){}

    /* CSVファイル扱えるようにするための初期設定 */
    public StudentServiceImpl(UserRepository userRepository, StudentRepository studentRepository,
                              AccountsHelper accountsHelper){
        /* 依存の注入 */
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.accountsHelper = accountsHelper;

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
    public UserEntity createStudent(StudentCreateRequest dto){

        UserEntity newStudentAccount = accountsHelper.toUserEntity(dto.getSchoolId(),
                                                                   dto.getShowUserId(),
                                                                   dto.getName(),
                                                                   dto.getMailAddress(),
                                                                   dto.getPassword()
                                                                   );
                                                        
        UserEntity savedUserEntity = userRepository.save(newStudentAccount);
        return savedUserEntity;
    }

    /* 登録した基本情報のユーザIDを元に、生徒情報を付加する */
    @Override
    public void setStudentEnrollmentInformation(StudentCreateRequest dto, UserEntity savedStudentAccount){

        StudentEntity studentInformation = toStudentEntity(savedStudentAccount,
                                                           dto.getGrade(),
                                                           dto.getAdmissionDate(),
                                                           dto.getGraduateDate()
                                                          );
        studentRepository.save(studentInformation);
    }

    /*
     * CSVファイルから一括で生徒アカウントを登録する機能
     * InputStream inputStream = csvFile.getInputStream(): アップロードされたCSVファイルの内容を読み取るためのストリーム
     *                                                   　(ストリームとは入力->整形->出力までの一連の流れを指す)
     * this.readCsv(inputStream): CSVファイルの内容をReadCSVFileStudentCreateRequestオブジェクトのリストに変換
     * records.stream(): recordsとして取得したリストをストリームとして処理を始める
     * .map(eachElement->this.toStudentEntityByFile(eachElement, schoolId)): 各レコードをStudentAccountPairオブジェクトに変換
     * .collect(Collectors.toList()): toStudentEntityByFileで変換した結果をList<?>に集約
     * StudentAccountPair::newUserAccount: StudentAccountPairオブジェクトから新しいUserEntityオブジェクトを取得
     * StudentAccountPair::newStudentAccount: StudentAccountPairオブジェクトから新しいStudentEntityオブジェクトを取得
     * try-with-resources構文: InputStreamを自動的に閉じるための構文
     */
    @Override
    public void createStudentByFile(MultipartFile csvFile, final Integer schoolId) throws IOException{
        try (InputStream inputStream = csvFile.getInputStream()){
            List<ReadCSVFileStudentCreateRequest> records = this.readCsv(inputStream);
            List<StudentAccountPair> fromCsvData = records.stream()
                                                   .map(recordEachElement->this.toStudentEntityByFile(recordEachElement, schoolId))
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
     * UserEntity->StudentEntityに変換するヘルプメソッド 
     */
    private StudentEntity toStudentEntity(UserEntity studentAccount, Integer grade, LocalDate admissionDate, LocalDate graduateDate){
        StudentEntity studentEnrollmentInformation = new StudentEntity();

        studentEnrollmentInformation.setStudentAccount(studentAccount);
        studentEnrollmentInformation.setGrade(grade);
        studentEnrollmentInformation.setAdmissionDate(admissionDate);

        if(graduateDate != null){
            studentEnrollmentInformation.setGraduateDate(graduateDate);
        }

        return studentEnrollmentInformation;
    }

    /* CSVファイルの要素をPOJOに変換 */
    private List<ReadCSVFileStudentCreateRequest> readCsv(InputStream inputStream) throws IOException{
        return csvObjectReader.<ReadCSVFileStudentCreateRequest>readValues(inputStream).readAll();
    }

    /* エンティティに挿入する処理 */
    private StudentAccountPair toStudentEntityByFile(ReadCSVFileStudentCreateRequest records, final Integer schoolId){

        UserEntity newUserAccount = accountsHelper.toUserEntity(schoolId,
                                                                records.showUserId(),
                                                                records.password(),
                                                                records.mailAddress(),
                                                                records.name()
                                                                );
        
        StudentEntity newStudentAccount = toStudentEntity(newUserAccount, 
                                                          records.grade(), 
                                                          records.admissionDate(), 
                                                          records.graduateDate()
                                                         );

        return new StudentAccountPair(newUserAccount, newStudentAccount);
    }


}
