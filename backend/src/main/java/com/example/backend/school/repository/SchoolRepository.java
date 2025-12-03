package com.example.backend.school.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.school.model.SchoolEntity;

/* JPAのRepositoryとの紐づけ
 * コンポーネントはJPA側のクラスになるので、@Repositoryは使用しない
 */
public interface SchoolRepository extends JpaRepository<SchoolEntity, Integer> {

} 