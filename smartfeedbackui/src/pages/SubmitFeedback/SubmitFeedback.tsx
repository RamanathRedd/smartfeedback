import React, { useState } from "react";
import { SubmitFeedbackData } from "./SubmitFeedback.types";
import axios from "axios";
import { Modal } from "bootstrap";
import ConfirmationModal from "../../common/modals/ConfirmationModal";
import { toast } from "react-toastify";

const SubmitFeedback: React.FC = () => {
  const categories = [
    { id: 1, name: "Department" },
    { id: 2, name: "Events" },
    { id: 3, name: "Services" },
    { id: 4, name: "Others" },
  ];
  const subCategories: { [key: number]: { id: number; name: string }[] } = {
    1: [
      { id: 1, name: "Development" },
      { id: 2, name: "Administration" },
      { id: 3, name: "HR" },
    ],
    2: [
      { id: 4, name: "IT Support Services" },
      { id: 5, name: "Workplace Tools & Software" },
      { id: 6, name: "Transportation" },
    ],
    3: [
      { id: 7, name: "Hackathons" },
      { id: 8, name: "Tech Talks" },
      { id: 9, name: "Employee Recognition Events" },
    ],
    4: [{ id: 10, name: "Other" }],
  };
  const [feedbackData, setFeedbackData] = useState<SubmitFeedbackData>({
    heading: "",
    category: -1,
    subCategory: -1,
    feedback: "",
  });
  const [mappedFeedbackData, setMappedFeedbackData] = useState({
    category: "",
    subCategory: "",
    feedback: "",
  });

  return (
    <>
      <div className="submit-feedback">
        <h2>Submit Feedback</h2>
        <form onSubmit={(e) => submittedFeedback(e)}>
          <label htmlFor="heading">
            Feedback Heading<span> *</span>
          </label>
          <input
            type="text"
            id="heading"
            name="heading"
            value={feedbackData.heading}
            onChange={setChanges}
            placeholder="Enter Heading"
            required
          ></input>
          <label htmlFor="category">
            Feedback Category<span> *</span>
          </label>
          <select
            name="category"
            value={feedbackData.category}
            onChange={setChanges}
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <label htmlFor="subCategory">
            Feedback Subcategory<span> *</span>
          </label>
          <select
            name="subCategory"
            value={feedbackData.subCategory}
            onChange={setChanges}
            required
          >
            <option value="">Select Sub Categories</option>
            {feedbackData.category != -1 &&
              subCategories[feedbackData.category] &&
              subCategories[feedbackData.category].map((subCategory) => (
                <option key={subCategory.id} value={subCategory.id}>
                  {subCategory.name}
                </option>
              ))}
          </select>
          <label htmlFor="feedback">
            Feedback<span> *</span>
          </label>
          <input
            type="text"
            id="feedback"
            name="feedback"
            value={feedbackData.feedback}
            onChange={setChanges}
            placeholder="Enter your Feedback"
            required
          ></input>
          <button
            type="submit"
            className={checkEnteredData() ? "not-allow-btn" : "submit-btn"}
            disabled={checkEnteredData()}
          >
            Submit
          </button>
        </form>
      </div>
      <ConfirmationModal
        feedbackData={mappedFeedbackData}
        onConfirm={confirmedFeedback}
      />
    </>
  );

  function submittedFeedback(e: any) {
    e.preventDefault();
    const displayData = {
      heading: feedbackData.heading,
      category:
        categories.find((item) => item.id === Number(feedbackData.category))
          ?.name || "",
      subCategory:
        subCategories[Number(feedbackData.category)]?.find(
          (item) => item.id === Number(feedbackData.subCategory)
        )?.name || "",
      feedback: feedbackData.feedback,
    };
    setMappedFeedbackData({
      category: displayData.category,
      subCategory: displayData.subCategory,
      feedback: displayData.feedback,
    });
    const modalElement = document.getElementById("confirmationModal");
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  async function confirmedFeedback() {
    try {
      await axios.post("http://localhost:5112/api/feedback", {
        ...feedbackData,
        FeedbackText: feedbackData.feedback,
        category: mappedFeedbackData.category,
        subCategory: mappedFeedbackData.subCategory,
      });
      setFeedbackData({
        heading: "",
        category: -1,
        subCategory: -1,
        feedback: "",
      });
      toast.success("Feedback submitted successful! 🎉");
    } catch (error: any) {
      toast.error("Something went wrong. Please try again.");
    }
  }

  function checkEnteredData() {
    return (
      feedbackData.heading === "" ||
      feedbackData.category === -1 ||
      feedbackData.subCategory === -1 ||
      feedbackData.feedback === ""
    );
  }

  function setChanges(e: any) {
    const { name, value } = e.target;
    setFeedbackData({ ...feedbackData, [name]: value });
  }
};

export default SubmitFeedback;
