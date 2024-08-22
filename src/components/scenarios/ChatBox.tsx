// src/components/ScenarioForm.tsx

import React, { useEffect, useState } from "react";
import {
  IonInput,
  IonItem,
  IonButton,
  IonTextarea,
  IonCard,
  IonList,
  IonText,
} from "@ionic/react";
import { Scenario, answerQuestion } from "../../data/scenarios";
import { useHistory } from "react-router";
interface ScenarioFormProps {
  scenario: Scenario;
}
const ChatBox: React.FC<ScenarioFormProps> = ({ scenario }) => {
  const [question, setQuestion] = useState<string>(scenario.question_1 || "");
  const history = useHistory();
  const [updatedScenario, setScenario] = useState<Scenario>(scenario);
  const [questionNumber, setQuestionNumber] = useState<number>(1);
  const [currentAnswer, setCurrentAnswer] = useState<string>("");
  const [questions, setQuestions] = useState<string[]>(
    scenario.questions || []
  );

  const handleAnswerChange = (answer: string, index: number) => {
    console.log("answer", answer);
    console.log("index", index);
    setQuestionNumber(index + 1);
    setCurrentAnswer(answer);
  };

  useEffect(() => {
    console.log("chat scenario", updatedScenario);
    console.log("chat question", updatedScenario.question_1);
    if (updatedScenario.question_1) {
      setQuestion(updatedScenario.question_1);
    }
    if (updatedScenario.questions) {
      console.log("setting questions", updatedScenario.questions);
      setQuestions(updatedScenario.questions);
    }
  }, []);
  const handleSubmit = async () => {
    const finalizing = questionNumber === 2;

    console.log("submitting finalizing", finalizing);
    console.log("submitting questionNumber", questionNumber);
    console.log("submitting currentAnswer", currentAnswer);
    const updatedScenario = await answerQuestion(
      scenario.id!,
      questionNumber,
      currentAnswer,
      finalizing
    );
    console.log("updatedScenario", updatedScenario);
    setScenario(updatedScenario);
    if (finalizing) {
      console.log("pushing to results", updatedScenario);
      history.push(`/scenarios/${scenario.id}`);
    } else {
      // setQuestionNumber(questionNumber + 1);
      // setCurrentAnswer("");
      window.location.reload();
    }
  };
  return (
    <div>
      <IonCard>
        <IonItem>
          <IonText className="mt-2 mr-3">
            Quesion Number: {questionNumber}
          </IonText>
          <IonText className="mt-2 mr-3">Name</IonText>
          <IonInput className="mt-3" value={scenario.name} required />
        </IonItem>
        <IonItem>
          <IonText className="mt-2 mr-3">Age Range</IonText>
          <IonText className="mt-2 mr-3">{scenario.age_range}</IonText>
        </IonItem>
        <IonItem>
          <IonText className="mt-2 mr-3">Initial Description</IonText>
          <IonTextarea
            value={scenario.initial_description}
            required
            className="mt-3"
          />
        </IonItem>

        {scenario.questions && (
          <IonList class="mt-3 p-2">
            {questions.map((q: any, i: number) => (
              <div key={i}>
                <IonItem className="mt-2 font-bold w-full">
                  <IonText className="mt-2 mr-3 text-xs w-1/6 md:w-1/8 lg:w-1/12">
                    Question {i + 1}
                  </IonText>
                  <IonText
                    className="mt-2 mr-3 w-5/6 md:w-7/8 lg:w-11/12"
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                  >
                    {q["question"]}
                  </IonText>
                </IonItem>
                {q["answer"] ? (
                  <IonItem>
                    <IonText className="mt-2 mr-3">Answer</IonText>
                    <IonText
                      className="mt-2 mr-3"
                      contentEditable={true}
                      suppressContentEditableWarning={true}
                    >
                      {q["answer"]}
                    </IonText>
                  </IonItem>
                ) : (
                  <IonItem>
                    <IonTextarea
                      className="mt-2 mr-3"
                      value={currentAnswer}
                      onIonInput={(e) => handleAnswerChange(e.detail.value!, i)}
                      required
                      placeholder="Type your answer here"
                    ></IonTextarea>
                  </IonItem>
                )}
              </div>
            ))}
          </IonList>
        )}
        <IonButton expand="full" onClick={handleSubmit}>
          Chat
        </IonButton>
      </IonCard>
    </div>
  );
};

export default ChatBox;
