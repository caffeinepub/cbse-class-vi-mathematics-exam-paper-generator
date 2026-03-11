import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Array "mo:core/Array";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Runtime "mo:core/Runtime";

actor {
  include MixinStorage();

  // Types and Modules
  type QuestionType = {
    #mcq;
    #shortAnswer;
    #longAnswer;
    #imageBased;
  };

  type Question = {
    id : Text;
    chapter : Nat;
    questionType : QuestionType;
    difficulty : Text;
    marks : Nat;
    content : Text;
    options : ?[Text];
    correctAnswer : Text;
    image : ?Storage.ExternalBlob;
  };

  type QuestionUpdateArgs = {
    chapter : Nat;
    questionType : QuestionType;
    difficulty : Text;
    marks : Nat;
    content : Text;
    options : ?[Text];
    correctAnswer : Text;
    image : ?Storage.ExternalBlob;
  };

  // Persistent Storage
  let questionBank = Map.empty<Text, Question>();

  var nextId = 1;

  // Query: Get all questions
  public query ({ caller }) func getAllQuestions() : async [Question] {
    questionBank.values().toArray();
  };

  // Query: Get question by ID
  public query ({ caller }) func getQuestionById(id : Text) : async Question {
    switch (questionBank.get(id)) {
      case (null) { Runtime.trap("Question not found") };
      case (?question) { question };
    };
  };

  // Query: Get questions by chapter
  public query ({ caller }) func getQuestionsByChapter(chapter : Nat) : async [Question] {
    questionBank.values().toArray().filter(
      func(q) {
        q.chapter == chapter
      }
    );
  };

  // Query: Get questions by type
  public query ({ caller }) func getQuestionsByType(qType : QuestionType) : async [Question] {
    questionBank.values().toArray().filter(
      func(q) {
        switch (q.questionType, qType) {
          case (#mcq, #mcq) { true };
          case (#shortAnswer, #shortAnswer) { true };
          case (#longAnswer, #longAnswer) { true };
          case (#imageBased, #imageBased) { true };
          case (_) { false };
        };
      }
    );
  };

  // Query: Get questions by chapter and type
  public query ({ caller }) func getQuestionsByChapterAndType(chapter : Nat, qType : QuestionType) : async [Question] {
    questionBank.values().toArray().filter(
      func(q) {
        q.chapter == chapter and q.questionType == qType
      }
    );
  };

  // Add new question
  public shared ({ caller }) func addQuestion(args : QuestionUpdateArgs) : async Text {
    let id = "Q" # nextId.toText();
    let question : Question = {
      id;
      chapter = args.chapter;
      questionType = args.questionType;
      difficulty = args.difficulty;
      marks = args.marks;
      content = args.content;
      options = args.options;
      correctAnswer = args.correctAnswer;
      image = args.image;
    };
    questionBank.add(id, question);
    nextId += 1;
    id;
  };

  // Update existing question
  public shared ({ caller }) func updateQuestion(id : Text, args : QuestionUpdateArgs) : async () {
    switch (questionBank.get(id)) {
      case (null) { Runtime.trap("Question not found") };
      case (?_) {
        let updatedQuestion : Question = {
          id;
          chapter = args.chapter;
          questionType = args.questionType;
          difficulty = args.difficulty;
          marks = args.marks;
          content = args.content;
          options = args.options;
          correctAnswer = args.correctAnswer;
          image = args.image;
        };
        questionBank.add(id, updatedQuestion);
      };
    };
  };

  // Delete question
  public shared ({ caller }) func deleteQuestion(id : Text) : async () {
    if (not questionBank.containsKey(id)) {
      Runtime.trap("Question not found");
    };
    questionBank.remove(id);
  };
};
