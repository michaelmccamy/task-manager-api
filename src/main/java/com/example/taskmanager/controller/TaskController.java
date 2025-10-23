package com.example.taskmanager.controller;
import com.example.taskmanager.model.Task;
import com.example.taskmanager.repository.TaskRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Comparator;
import java.util.stream.Collectors;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskRepository taskRepository;

    public TaskController(TaskRepository taskRepository){
        this.taskRepository = taskRepository;
    }
    // GET all tasks
    @GetMapping
    public List<Task> getAllTasks(
            @RequestParam(required = false) Boolean completed,
            @RequestParam(required = false, defaultValue = "false") boolean overdue,
            @RequestParam(required = false, defaultValue = "false") boolean sortByDueDate
            ) {
        List<Task> tasks = taskRepository.findAll();
        if(completed != null) {
            tasks = tasks.stream()
                    .filter(t -> t.isCompleted() == completed)
                    .collect(Collectors.toList());
        }
        if (overdue){
            LocalDate today = LocalDate.now();
            tasks = tasks.stream()
                    .filter(t-> t.getDueDate() != null && t.getDueDate().isBefore(today))
                    .collect(Collectors.toList());
        }
        if(sortByDueDate){
            tasks = tasks.stream()
                    .sorted(Comparator.comparing(
                            Task::getDueDate,
                            Comparator.nullsLast(Comparator.naturalOrder())
                    ))
                    .collect(Collectors.toList());
        }
        return tasks;
    }

    // POST create task
    @PostMapping
    public Task createTask(@Valid @RequestBody Task task) {
        return taskRepository.save(task);
    }

    // GET single task
    @GetMapping("/{id}")
    public Task getTask(@PathVariable Long id) {
        return taskRepository.findById(id).orElse(null);
    }

    // PUT update task
    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task updatedTask) {
        return taskRepository.findById(id).map(task -> {
            task.setTitle(updatedTask.getTitle());
            task.setDescription(updatedTask.getDescription());
            task.setDueDate(updatedTask.getDueDate());
            task.setCompleted(updatedTask.isCompleted());
            return taskRepository.save(task);
        }).orElse(null);
    }

    // DELETE task
    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskRepository.deleteById(id);
    }

    // PATCH /api/tasks/{id}/complete -- sets completed = true
    @PatchMapping("/{id}/complete")
    public ResponseEntity<Task> markComplete(@PathVariable Long id) {
        return taskRepository.findById(id).map(task-> {
            if (!task.isCompleted()) {
                task.setCompleted(true);
                taskRepository.save(task);
            }
            return ResponseEntity.ok(task);
        }).orElse(ResponseEntity.notFound().build());
    }

    // PATCH /api/tasks/{id}/incomplete -- sets completed = false
    @PatchMapping("/{id}/incomplete")
    public ResponseEntity<Task> markIncomplete(@PathVariable Long id) {
        return taskRepository.findById(id).map(task-> {
            if (task.isCompleted()) {
                task.setCompleted(false);
                taskRepository.save(task);
            }
            return ResponseEntity.ok(task);
        }).orElse(ResponseEntity.notFound().build());
    }
}
