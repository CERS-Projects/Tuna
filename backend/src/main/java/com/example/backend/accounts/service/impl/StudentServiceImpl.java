package com.example.backend.accounts.service.impl;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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

    /* コンストラクタ */
    public StudentServiceImpl(UserRepository userRepository, StudentRepository studentRepository,
                              AccountsHelper accountsHelper){
        /* 依存の注入 */
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.accountsHelper = accountsHelper;

        CsvMapper csvMapper = new CsvMapper();
        csvMapper.registerModule(new JavaTimeModule());

        CsvSchema csvSchema = csvMapper.schemaFor(ReadCSVFileStudentCreateRequest.class)
                                       .withHeader()
                                       .withColumnReordering(true);
        
        this.csvObjectReader = csvMapper.readerFor(ReadCSVFileStudentCreateRequest.class)
                                        .with(csvSchema);
    }

    /* ユーザデータの基本情報を登録（生徒） */
    @Override
    @Transactional
    public UserEntity createStudent(StudentCreateRequest dto){

        UserEntity newStudentAccount = new UserEntity();

        newStudentAccount = accountsHelper.toUserEntity(dto.getSchoolId(),
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
    @Transactional
    public void setStudentEnrollmentInformation(StudentCreateRequest dto, UserEntity savedStudentAccount){
        StudentEntity studentInformation = new StudentEntity();

        /* 
         * Optional:Nullを持つ可能性とNullを持たない可能性のあるもの
         * Nullを保持する可能性がある変数を明示的に定義とdtoから値を取得し代入を行う処理、
         * その後、optionalGraduateDateがnullの場合はorElseの引数を代入し、
         * そうでない場合はOptionalGraduateDateに入っている値が代入される
         */
        LocalDate graduateDate = Optional.ofNullable(dto.getGraduateDate()).orElse(null);

            studentInformation = toStudentEntity(savedStudentAccount,
                                                 dto.getGrade(),
                                                 dto.getAdmissionDate(),
                                                 graduateDate
                                                );
        studentRepository.save(studentInformation);
    }

    @Transactional
    public void createStudentByFile(MultipartFile csvFile, final Integer schoolId) throws IOException{
        try (InputStream inputStream = csvFile.getInputStream()){
            List<ReadCSVFileStudentCreateRequest> records = this.readCsv(inputStream);
            List<StudentAccountPair> fromCsvData = records.stream()
                                                   .map(dto->this.toStudentEntityByFile(dto, schoolId))
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


    private List<ReadCSVFileStudentCreateRequest> readCsv(InputStream inputStream) throws IOException{
        return csvObjectReader.<ReadCSVFileStudentCreateRequest>readValues(inputStream).readAll();
    }

    private StudentAccountPair toStudentEntityByFile(ReadCSVFileStudentCreateRequest records, final Integer schoolId){

        UserEntity newUserAccount = new UserEntity();
        StudentEntity newStudentAccount = new StudentEntity();

        newUserAccount = accountsHelper.toUserEntity(schoolId,
                                                     records.showUserId(),
                                                     records.name(),
                                                     records.password(),
                                                     records.mailAddress()
                                                     );
        
        newStudentAccount = toStudentEntity(newUserAccount, 
                                            records.grade(), 
                                            records.admissionDate(), 
                                            records.graduateDate()
                                            );

        return new StudentAccountPair(newUserAccount, newStudentAccount);
    }


}
