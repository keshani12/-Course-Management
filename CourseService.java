package com.example.cookingapp.service;

import com.example.cookingapp.model.Course;
import com.example.cookingapp.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class CourseService {

    @Autowired
    private CourseRepository repo;

    @Autowired
    private MongoTemplate mongoTemplate;

    /**
     * Fetch paged, filtered list of courses.
     */
    public Page<Course> findAll(
            String title,
            String priorityLevel,
            LocalDate targetDate,
            boolean includeArchived,
            Pageable pageable
    ) {
        Criteria criteria = new Criteria();
        if (!includeArchived) {
            criteria = criteria.and("archived").is(false);
        }
        if (title != null && !title.isBlank()) {
            criteria = criteria.and("title").regex(title, "i");
        }
        if (priorityLevel != null && !priorityLevel.isBlank()) {
            criteria = criteria.and("priorityLevel").is(priorityLevel);
        }
        if (targetDate != null) {
            criteria = criteria.and("targetDate").is(targetDate);
        }

        Query query = new Query(criteria).with(pageable);
        List<Course> list = mongoTemplate.find(query, Course.class);
        long count = mongoTemplate.count(Query.of(query).limit(-1).skip(-1), Course.class);

        return new PageImpl<>(list, pageable, count);
    }

    public Optional<Course> findById(String id) {
        return repo.findById(id);
    }

    public Course create(Course course) {
        return repo.save(course);
    }

    public Course update(String id, Course course) {
        return repo.findById(id)
                .map(existing -> {
                    existing.setTitle(course.getTitle());
                    existing.setSummary(course.getSummary());
                    existing.setCategory(course.getCategory());
                    existing.setLevel(course.getLevel());
                    existing.setDuration(course.getDuration());
                    existing.setContent(course.getContent());
                    existing.setSubject(course.getSubject());
                    existing.setTargetDate(course.getTargetDate());
                    existing.setPriorityLevel(course.getPriorityLevel());
                    existing.setMaterials(course.getMaterials());
                    return repo.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Course not found"));
    }

    /** Permanently delete a course */
    public void delete(String id) {
        repo.deleteById(id);
    }

    /** Archive a course instead of deleting */
    public Course archive(String id) {
        return repo.findById(id)
                .map(c -> {
                    c.setArchived(true);
                    return repo.save(c);
                })
                .orElseThrow(() -> new RuntimeException("Course not found"));
    }

    /** Toggle or mark as completed */
    // src/main/java/com/example/cookingapp/service/CourseService.java
    public Course markCompleted(String id, boolean completed) {
        return repo.findById(id)
                .map(c -> {
                    c.setCompleted(completed);
                    // if marking done, record today; otherwise clear
                    c.setCompletedDate(completed ? LocalDate.now() : null);
                    return repo.save(c);
                })
                .orElseThrow(() -> new RuntimeException("Course not found"));
    }

}
