# CBSE Class VI Mathematics Exam Paper Generator

## Overview
An application that generates CBSE Class VI Mathematics annual exam papers in Microsoft Word format, sourcing questions from Ganit Prakash New Book chapters 4-10.

## Core Features

### Question Bank Management
- Store questions from Ganit Prakash New Book chapters 4, 5, 6, 7, 8, 9, and 10
- Categorize questions by:
  - Chapter number
  - Question type (MCQ, Short Answer, Long Answer)
  - Difficulty level (moderate for annual exam)
  - Marks allocation
- Include image-based questions where applicable from the source book

### Exam Paper Generation
- Generate complete annual exam papers with:
  - Multiple Choice Questions (MCQs)
  - Short answer questions
  - Long answer questions
  - Image-based/picture questions from the book
- Ensure moderate difficulty level suitable for annual examination
- Automatic marks distribution across question types

### Word Document Export
- Generate properly formatted Microsoft Word (.docx) files
- Include:
  - Exam header with school details placeholder
  - Clear section headings for different question types
  - Proper spacing and formatting
  - Marks distribution for each question
  - Instructions for students
  - Total marks and time duration

### User Interface
- Simple form to configure exam paper:
  - Select specific chapters (from 4-10)
  - Choose number of questions per type
  - Set total marks for the paper
- Preview generated paper before download
- Download button for Word document

## Backend Data Storage
- Question database with questions from specified chapters
- Question metadata (chapter, type, marks, difficulty)
- Image references for picture-based questions

## Backend Operations
- Retrieve questions based on selected criteria
- Generate randomized question selection for exam variety
- Format questions into structured exam paper layout
- Generate Word document with proper formatting
