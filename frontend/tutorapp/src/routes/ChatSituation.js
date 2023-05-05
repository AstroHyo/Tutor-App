import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { setUserSituation } from "./../store.js"
import { Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './ChatSituation.css';

function ChatSituation() {
  const navigate = useNavigate();
  let dispatch = useDispatch()
  let userSituation = useSelector((state) => state.userSituation ) //채팅 상황 설정
  const [situationInput, setSituationInput] = useState(''); // add state variable

  const handleFormSubmit = () => {
    dispatch(setUserSituation(situationInput)); // dispatch the form content to Redux store
  };

  return (
    <div className="ChatSituation">
      {/*
      <div className="container">
        <form className="userForm">
          <div>
            <h3>대화를 연습할 상황을 알려주세요!</h3>
            <input placeholder="예)OPIC 대화를 연습하고 싶어" />
            <button type="submit" id="submitBtn" className="click">다음</button>
          </div>
        </form>
      </div>
  */}

      <Form className="userForm">
        <Col>
            <Form.Group as={Row} className="mb-3" controlId="">
            <Col sm>
              <Form.Label className="formTitle">대화를 나누고 싶은 상황을 알려주세요!</Form.Label>
              <p className="formDesc">구체적으로 상황을 입력할수록 더 원하는 상황에 맞게 대화할 수 있어요</p>
              <Form.Control as="textarea" placeholder="예)OPIc 대화를 연습하고 싶어" className="situationInput" value={situationInput} onChange={(event) => setSituationInput(event.target.value)} /> 
            </Col>
            </Form.Group>

            <button className="mainBtn" onClick={() =>{ handleFormSubmit(); navigate('/chatWithTutorSitu')}}>
                위 상황으로 대화 시작하기!
            </button>
        </Col>
      </Form>
    </div>
  );
}

export default ChatSituation;