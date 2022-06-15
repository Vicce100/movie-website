import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/PostFile.scss';

// create state for storing file in
export default function PostFile() {
  const [file, setFile] = useState<string | Blob | null>(null);
  const navigate = useNavigate();

  const fileChangeHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setFile(e.target.files && e.target.files[0]),
    []
  );

  useEffect(() => {
    if (!file) return;
    console.log(file);
  }, [file]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!file) return;
      const formData = new FormData();
      formData.append('file', file);

      const options = {
        method: 'POST',
        headers: {
          // 'Content-Type': 'multipart/form-data',
          // boundary: '----WebKitFormBoundary7MA4YWxkTrZu0gW',
          Accept: '*/*',
        },
        body: formData,
      };
      try {
        const res = await fetch('http://localhost:5050/image/upload/multiple', options);
        if (res.ok) navigate('/');
      } catch (error) {
        console.log(error);
      }
    },
    [file, navigate]
  );
  return (
    <div>
      <h1>PostFile</h1>
      <form
        action="http://localhost:5050/image/upload/multiple"
        method="POST"
        encType="multipart/form-data"
        // onSubmit={handleSubmit}
      >
        <input type="file" name="images" multiple className="form-control" />
        {/* <input type="file" name="images2" multiple className="form-control" /> */}
        {/* <input type="hidden" defaultValue="qwerty" placeholder="name" name="name" /> */}
        <button type="submit">upload</button>
      </form>
    </div>
  );
}
