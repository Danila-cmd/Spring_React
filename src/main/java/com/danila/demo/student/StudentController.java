package com.danila.demo.student;

import com.danila.demo.exception.ApiRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("students")
public class StudentController {

    private final StudentService studentService;

    @Autowired
    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping
    public List<Student> getAllStudents() {
        if(studentService.getAllStudents().isEmpty()){
            throw new ApiRequestException("Oops cannot get all students!!!");
        }
        return studentService.getAllStudents();
    }

    @PostMapping
    public void addNewStudent(@RequestBody @Valid Student student) {
        studentService.addNewStudent(student);
    }
}
