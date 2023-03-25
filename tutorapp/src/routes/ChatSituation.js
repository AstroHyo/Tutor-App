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
              <Stack gap={2} className="example">
                <Stack direction="horizontal" gap={3}>
                  <button className="exampleBox" onClick={() =>{ }}>📚OPIC 공부 좀 도와줘!</button>
                  <button className="exampleBox" onClick={() =>{ }}>💘두근두근 소개팅 하루 전날!</button>
                  <button className="exampleBox" onClick={() =>{ }}>🤝네..? 외국계 회사랑 비즈니스 미팅이요?</button>
                </Stack>
                <Stack direction="horizontal" gap={3} className="exampleContainer">
                  <button className="exampleBox" onClick={() =>{ }}>📈영어로 진행하는 회사 인터뷰</button>
                  <button className="exampleBox" onClick={() =>{ }}>☕오랜만에 만난 외국인 친구랑</button>
                  <button className="exampleBox" onClick={() =>{ }}>💬회사 동료랑 스몰토크!</button>
                </Stack>
              </Stack>
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