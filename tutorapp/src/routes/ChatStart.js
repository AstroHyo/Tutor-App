import { useState } from 'react';
import { Stack, Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './ChatStart.css';


function ChatStart() {
  const navigate = useNavigate();

  return (
    <div className="ChatStart">
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
              <Form.Label className="formTitle">대화를 연습할 상황을 알려주세요!</Form.Label>
              <p>아래 상황 중 하나를 선택하거나 원하는 상황을 알려주세요!</p>
              <Stack gap={2} className="example">
                <Stack direction="horizontal" gap={3}>
                  <div className="exampleBox"></div>
                  <div className="exampleBox"></div>
                  <div className="exampleBox"></div>
                </Stack>
                <Stack direction="horizontal" gap={3} className="exampleContainer">
                  <div className="exampleBox"></div>
                  <div className="exampleBox"></div>
                  <div className="exampleBox"></div>
                </Stack>
              </Stack>
              <Form.Control type="text"  placeholder="예)OPIC 대화를 연습하고 싶어" />
            </Col>
            </Form.Group>

            <button className="click"
              onClick={() =>{ 
                navigate('/chatWithTutor')
                }}>
            Submit
            </button>
        </Col>
      </Form>
    </div>
  );
}

export default ChatStart;