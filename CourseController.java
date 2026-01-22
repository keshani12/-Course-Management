package com.example.cookingapp.controller;

import com.example.cookingapp.model.Course;
import com.example.cookingapp.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*")
public class CourseController {

    @Autowired
    private CourseService service;

    /**
     * GET /api/courses
     * Optional filters: subject, priorityLevel, before, after, includeArchived
     * Pagination: page (0-index), size, sort
     */
    @GetMapping
    public Page<Course> getAll(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String priorityLevel,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate targetDate,
            @RequestParam(defaultValue = "false") boolean includeArchived,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "title,asc") String[] sort
    ) {
        Sort.Direction dir = Sort.Direction.fromString(sort[1]);
        Sort s = Sort.by(dir, sort[0]);
        Pageable pageable = PageRequest.of(page, size, s);

        return service.findAll(title, priorityLevel, targetDate, includeArchived, pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getById(@PathVariable String id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Course create(@RequestBody Course course) {
        return service.create(course);
    }

    @PutMapping("/{id}")
    public Course update(@PathVariable String id, @RequestBody Course course) {
        return service.update(id, course);
    }

    /** Permanent delete */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable String id) {
        service.delete(id);
        Map<String, String> resp = new HashMap<>();
        resp.put("message", "Course deleted permanently");
        return ResponseEntity.ok(resp);
    }

    /** Archive instead of delete */
    @PatchMapping("/{id}/archive")
    public Course archive(@PathVariable String id) {
        return service.archive(id);
    }

    /** Mark as completed/uncompleted */
    @PatchMapping("/{id}/complete")
    public Course markCompleted(
            @PathVariable String id,
            @RequestParam(defaultValue = "true") boolean completed
    ) {
        return service.markCompleted(id, completed);
    }
}
