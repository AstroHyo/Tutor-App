import { useState } from 'react';
import { Stack, Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './ChatSituation.css';

function ChatSituation() {
  const navigate = useNavigate();

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
              <Form.Control as="textarea" placeholder="예)OPIC 대화를 연습하고 싶어" className="situationInput" />
            </Col>
            </Form.Group>

            <button className="click" onClick={() =>{ navigate('/chatWithTutor')}}>
                위 상황으로 대화 시작하기!
            </button>
        </Col>
      </Form>
    </div>
  );
}

export default ChatSituation;