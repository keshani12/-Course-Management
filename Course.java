package com.example.cookingapp.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.List;

@Document(collection = "courses")
public class Course {
    @Id
    private String id;
    private String title;
    private String summary;
    private String category;
    private String level;
    private String duration;
    private List<String> content;

    // New fields:
    private String subject;
    private LocalDate targetDate;
    private String priorityLevel;
    private List<String> materials; // URLs or file identifiers
    private boolean completed = false;
    private boolean archived = false;
    private LocalDate completedDate;      // <<< new field

    public Course() { }

    public Course(String title,
                  String summary,
                  String category,
                  String level,
                  String duration,
                  List<String> content,
                  String subject,
                  LocalDate targetDate,
                  String priorityLevel,
                  List<String> materials) {
        this.title = title;
        this.summary = summary;
        this.category = category;
        this.level = level;
        this.duration = duration;
        this.content = content;
        this.subject = subject;
        this.targetDate = targetDate;
        this.priorityLevel = priorityLevel;
        this.materials = materials;
    }

    // --- Getters & Setters ---
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
    public LocalDate getCompletedDate() { return completedDate; }
    public void setCompletedDate(LocalDate completedDate) { this.completedDate = completedDate; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public List<String> getContent() { return content; }
    public void setContent(List<String> content) { this.content = content; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public LocalDate getTargetDate() { return targetDate; }
    public void setTargetDate(LocalDate targetDate) { this.targetDate = targetDate; }

    public String getPriorityLevel() { return priorityLevel; }
    public void setPriorityLevel(String priorityLevel) { this.priorityLevel = priorityLevel; }

    public List<String> getMaterials() { return materials; }
    public void setMaterials(List<String> materials) { this.materials = materials; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }

    public boolean isArchived() { return archived; }
    public void setArchived(boolean archived) { this.archived = archived; }
}
