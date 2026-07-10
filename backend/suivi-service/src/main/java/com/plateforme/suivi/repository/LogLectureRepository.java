package com.plateforme.suivi.repository;

import com.plateforme.suivi.model.LogLecture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LogLectureRepository extends JpaRepository<LogLecture, Long> {
    List<LogLecture> findByApprenantId(Long apprenantId);
    List<LogLecture> findByApprenantIdAndChapitreId(Long apprenantId, Long chapitreId);
}
