import React, { useState } from 'react';

function PreRequest() {
  let preReqText = "사전 신청 해주신 분들에게 한에 서비스가 완성되는 대로 말씀드릴게요"


  return (
    <div>
      <div className="preForm">
        <div className="preFormContent">
          <p className="preFormTitle">TutoReal 사전 신청하기</p>
          <p className="preFormDis"> {preReqText} </p>
        </div>
        <div className="preFormBox" data-mooform-id="22195778-0b79-46e9-8a15-c89680bc38f3" ></div>
      </div>
    </div>
  );
}

export default PreRequest;