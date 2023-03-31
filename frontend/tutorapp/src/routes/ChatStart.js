import { useState } from 'react';
import { Stack, Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './ChatStart.css';


function ChatStart() {
  const navigate = useNavigate();

  return (
    <div className="ChatStart">

      <Form className="userForm">
        <Col>
            <Form.Group as={Row} className="mb-3" controlId="">
            <Col sm>
              <Form.Label className="formTitle">어떤 대화를 나눠볼까요?</Form.Label>
              <p className="formDesc">아래 상황 중 하나를 선택하거나 원하는 상황을 알려주세요!</p>
              <Stack gap={2} className="example">
                <Stack direction="horizontal" gap={3}>
                  <button className="exampleBox" onClick={() =>{ navigate('/test') }}>📚OPIC 공부 좀 도와줘!</button>
                  <button className="exampleBox" onClick={() =>{ navigate('/chatWithTutor') }}>💘두근두근 소개팅 하루 전날!</button>
                  <button className="exampleBox" onClick={() =>{ navigate('/chatWithTutor') }}>🤝네..? 외국계 회사랑 비즈니스 미팅이요?</button>
                </Stack>
                <Stack direction="horizontal" gap={3} className="exampleContainer">
                  <button className="exampleBox" onClick={() =>{ navigate('/chatWithTutor') }}>📈영어로 진행하는 회사 인터뷰</button>
                  <button className="exampleBox" onClick={() =>{ navigate('/chatWithTutor') }}>☕오랜만에 만난 외국인 친구랑</button>
                  <button className="exampleBox" onClick={() =>{ navigate('/chatWithTutor') }}>💬회사 동료랑 스몰토크!</button>
                </Stack>
              </Stack>
            </Col>
            </Form.Group>

            <button className="click" onClick={() =>{ navigate('/chatSituation')                }}>
              내가 원하는 상황은 여기 없는데...
            </button>
        </Col>
      </Form>
    </div>
  );
}

export default ChatStart;