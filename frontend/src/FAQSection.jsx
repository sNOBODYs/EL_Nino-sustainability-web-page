import { useState, useEffect } from "react";
import "./FAQSection.css";

const demoFAQs = [
    {
        id: 1,
        question: "What exactly are you measuring?",
        answer: "An answer will go here later :)"
    },
    {
        id: 2,
        question: "Why no physical product label?",
        answer: "An answer will go here later :)"
    },
    {
        id: 3,
        question: "Are electric cars zero-emission?",
        answer: "An answer will go here later :)"
    },
    {
        id: 4,
        question: "How often is the footprint updated?",
        answer: "An answer will go here later :)"
    },
    {
        id: 5,
        question:
            "Can customers see the footprint of their own site? (A good thing to do, maybe?)",
        answer: "An answer will go here later :)"
    }
];

function FAQSection() {
    const [faqs, setFaqs] = useState(demoFAQs);
    const [openQuestion, setOpenQuestion] = useState(null);

    const API_URL = import.meta.env.VITE_FAQ_API_URL;

    useEffect(() => {
        if (!API_URL) return;

        const controller = new AbortController();

        async function fetchFAQs() {
            try {
                const response = await fetch(API_URL, {
                    signal: controller.signal
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch FAQs");
                }

                const data = await response.json();

                if (Array.isArray(data)) {
                    const validFAQs = data.filter(
                        (faq) =>
                            faq &&
                            typeof faq.question === "string" &&
                            faq.question.trim() !== ""
                    );

                    if (validFAQs.length > 0) {
                        setFaqs(
                            validFAQs.map((faq, index) => ({
                                id: String(faq.id ?? index),
                                question: faq.question,
                                answer: faq.answer ?? ""
                            }))
                        );
                    } else {
                        setFaqs(demoFAQs);
                    }
                } else {
                    setFaqs(demoFAQs);
                }
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error("FAQ API error:", error);
                    setFaqs(demoFAQs);
                }
            }
        }

        fetchFAQs();

        return () => controller.abort();
    }, [API_URL]);

    function toggleQuestion(id) {
        setOpenQuestion((previous) =>
            previous === id ? null : id
        );
    }

    return (
        <section className="faq-section">
            <div className="faq-container">

                <div className="faq-sticker">
                    <span>COMMON CURIOSITIES</span>
                </div>

                <h2 className="faq-heading">
                    Frequently Asked.
                </h2>

                <div className="faq-list">
                    {faqs.map((faq) => {
                        const isOpen = openQuestion === faq.id;

                        return (
                            <div
                                key={faq.id}
                                className={`faq-item ${isOpen ? "faq-item-open" : ""}`}
                            >
                                <button
                                    type="button"
                                    className="faq-question"
                                    onClick={() => toggleQuestion(faq.id)}
                                    aria-expanded={isOpen}
                                    aria-controls={`faq-answer-${faq.id}`}
                                >
                                    <span>{faq.question}</span>

                                    <span
                                        className="faq-icon"
                                        aria-hidden="true"
                                    />
                                </button>

                                <div
                                    id={`faq-answer-${faq.id}`}
                                    className={`faq-answer-panel ${isOpen ? "is-open" : ""}`}
                                    aria-hidden={!isOpen}
                                >
                                    <div className="faq-answer-inner">
                                        <p className="faq-answer-text">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default FAQSection;