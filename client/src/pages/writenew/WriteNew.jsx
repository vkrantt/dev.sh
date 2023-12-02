import React from "react";
import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./WriteNew.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BASE_URL } from "../../config/config";
import axios from "axios";
import { get } from "../../components/handlers/storage";
import { useEffect } from "react";
import Loader from "../../components/loader/Loader";

const WriteNew = () => {
  const [searchParams] = useSearchParams();
  const postId = searchParams.get("id");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    tag: "",
    shared: false,
  });
  const [postFromId, setPostFromId] = useState();

  useEffect(() => {
    if (!postId) {
      setForm({
        title: "",
        description: "",
        tag: "",
        shared: false,
      });
      setPostFromId(null);
    }
  }, [postId]);

  // date note details For update
  useEffect(() => {
    if (postId) {
      setLoading(true);
      axios
        .get(`${BASE_URL}/post/getPostDetailsById/${postId}`, {
          headers: {
            "Content-Type": "application/type",
            Authorization: `Bearer ${get("dsh_token")}`,
          },
        })
        .then(function (response) {
          setPostFromId(response.data.response);
          const data = response.data.response;
          setValue(data?.description);

          setForm({
            ...form,
            title: data.title,
            tag: data.tag,
            description: data.description,
            shared: data.shared,
          });

          setLoading(false);
        })
        .catch(function () {
          setLoading(false);
        });
    }
  }, [postId]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSocialShare = (e) => {
    setForm({
      ...form,
      shared: e.target.checked,
    });
  };

  const handleSelectTag = (e) => {
    setForm({
      ...form,
      tag: e.target.value,
    });
  };

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image", "video"],
        ["blockquote", "code-block"],
        [{ align: [] }],
        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        ["clean"],
      ],
    },
  };

  const formats = [
    "header",
    "align",
    "blockquote",
    "bold",
    "code",
    "code-block",
    "color",
    "background",
    "font",
    "italic",
    "link",
    "list",
    "bullet",
    "indent",
    "underline",
    "strike",
    "script",
    "image",
  ];

  const quillRef = React.useRef();

  const editorStyle = {
    fontFamily: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
  Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif`,
    fontSize: "18px",
    height: "800px",
  };

  const checkForUpdate = (id) => {
    if (id) {
      return `${BASE_URL}/post/updatePost/${id}`;
    } else {
      return `${BASE_URL}/post/create`;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const editorContent = quillRef.current.value;
    form.description = editorContent;
    setLoading(true);
    const url = checkForUpdate(postFromId?._id);
    axios
      .post(url, form, {
        headers: {
          Authorization: `Bearer ${get("dsh_token")}`,
        },
      })
      .then(function (response) {
        if (response.data.status === 400) {
          setLoading(false);
        } else {
          setLoading(false);
          setTimeout(() => {
            if (postFromId?._id) {
              navigate("/view");
            } else {
              navigate("/");
            }
          }, 500);
        }
        setLoading(false);
      })
      .catch(function (error) {
        setLoading(false);
      });
  };

  return (
    <Container>
      <Row>
        <Col lg="8" md="12" sm="12" className="m-auto mb-5">
          <Form>
            <Row className="mb-3">
              <h1 className="display-4 fw-bold text-blue my-3">
                Create and share
              </h1>
            </Row>
            <Row className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Group as={Col}>
                <Form.Control
                  type="text"
                  name="title"
                  onChange={handleChange}
                  value={form.title}
                  className=" shadow-none bg-dark text-light border-0"
                />
              </Form.Group>
            </Row>

            <Row className="mb-3 mx-0">
              <Form.Label className="mx-0">Tags</Form.Label>
              <Form.Select
                as={Col}
                aria-label="Default select example"
                className=" shadow-none bg-dark text-light border-0"
                onChange={handleSelectTag}
                value={form.tag}
              >
                <option>Select Tag</option>
                <option value="programming">Programming</option>
                <option value="data science">Data science</option>
                <option value="Technology">Technology</option>
                <option value="machine learning">Machine Learning</option>
                <option value="productivity">Productivity</option>
                <option value="health">Health</option>
                <option value="education">Education</option>
                <option value="social">Social</option>
                <option value="business">Business</option>
                <option value="marketing">Marketing</option>
                <option value="relationships">Relationships</option>
                <option value="world">World</option>
                <option value="others">Others</option>
              </Form.Select>
            </Row>

            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={value}
              onChange={setValue}
              modules={modules}
              formats={formats}
              style={editorStyle}
              className="shadow-none bg-dark text-light border-0"
            />

            <Form.Check
              type="switch"
              id="custom-switch"
              label="Social share"
              className="mt-5"
              onChange={handleSocialShare}
              checked={form.shared}
            />

            <Button
              variant="primary"
              className=" rounded-2 px-4 text-light mt-4"
              type="submit"
              onClick={handleSubmit}
            >
              {loading ? <Loader /> : postId ? "Update" : "Post"}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default WriteNew;
