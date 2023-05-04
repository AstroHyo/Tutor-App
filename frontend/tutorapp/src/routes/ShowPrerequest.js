import React, { useState } from 'react';

function PreRequest() {
  const [showForm, setShowForm] = useState(false);

  const handleButtonClick = () => {
    setShowForm(true);
  }

  return (
    <div>
      <button onClick={handleButtonClick}>베타서비스가 마음에 드셨다면 클릭!</button>
      {showForm && (
        <div className="engage-hub-form-embed" id="eh_form_6430245462212608" data-id="6430245462212608"></div>
      )}
    </div>
  );
}

export default PreRequest;