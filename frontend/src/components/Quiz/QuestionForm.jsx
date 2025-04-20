import React, { useState, useEffect } from "react";

const QuestionForm = ({ question, index, onSubmit, onDelete, onCancel }) => {
  const [text, setText] = useState("");
  const [options, setOptions] = useState([{ text: "" }, { text: "" }, { text: "" }, { text: "" }]);
  const [correctOptionIndex, setCorrectOptionIndex] = useState(0);

  useEffect(() => {
    if (question) {
      setText(question.text || question.questionText || "");
      setOptions(
        question.options?.map(opt => typeof opt === "string" ? { text: opt } : opt) ||
        [{ text: "" }, { text: "" }, { text: "" }, { text: "" }]
      );
      setCorrectOptionIndex(question.correctOptionIndex || 0);
    }
  }, [question]);

  const handleOptionChange = (value, idx) => {
    const updated = [...options];
    updated[idx].text = value;
    setOptions(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newQuestion = {
      questionText: text,  // Updated field to match QuizForm
      options,
      correctOptionIndex: parseInt(correctOptionIndex),
    };
    onSubmit(newQuestion);

    if (!question) {
      setText("");
      setOptions([{ text: "" }, { text: "" }, { text: "" }, { text: "" }]);
      setCorrectOptionIndex(0);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium">Question:</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full border rounded p-2"
          rows={3}
          placeholder="Enter your question here"
          required
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Options:</label>
        {options.map((opt, idx) => (
          <div key={idx} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={opt.text}
              onChange={(e) => handleOptionChange(e.target.value, idx)}
              className="flex-1 border p-2 rounded"
              placeholder={`Option ${idx + 1}`}
              required
            />
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name={`correctOption-${index ?? "new"}`}
                checked={correctOptionIndex === idx}
                onChange={() => setCorrectOptionIndex(idx)}
              />
              Correct
            </label>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {question ? "Update" : "Add"} Question
        </button>

        {question && (
          <button
            type="button"
            onClick={onDelete}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Delete
          </button>
        )}

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default QuestionForm;
