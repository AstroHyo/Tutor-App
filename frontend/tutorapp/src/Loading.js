import React from 'react';
import {Background, LoadingText} from './LoadingStyle.js';
import Spinner from './assets/spinner.gif';

export default () => {
  return (
    <Background>
      <LoadingText>AI Tutor 메모리 세팅 중!</LoadingText>
      <img src={Spinner} alt="로딩중" width="5%" />
    </Background>
  );
};