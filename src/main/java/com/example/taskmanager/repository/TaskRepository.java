package com.example.taskmanager.repository;

import com.example.taskmanager.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Sort;
import java.time.LocalDate;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByCompleted(boolean completed);
    List<Task> findAll(Sort sort);
    List<Task> findByCompleted(boolean completed, Sort sort);
    List<Task> findByDueDateBefore(LocalDate date);
    List<Task> findByDueDateBeforeAndCompleted(LocalDate date, boolean completed);
}