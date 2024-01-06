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
import Alertmodal from "../../modals/alert/Alertmodal";
import { tags } from "../../components/json/tags";
import { Key } from "lucide-react";

const WriteNew = () => {
  const [searchParams] = useSearchParams();
  const postId = searchParams.get("id");
  const navigate = useNavigate();

  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

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

    if (!form.title || !form.description || !form.tag) {
      setShowAlertModal(true);
      setAlertMessage("Please fill all the fields");
      return;
    }
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
      {/* Render alert modal */}
      <Alertmodal
        message={alertMessage}
        handleShow={showAlertModal}
        setShowAlertModal={setShowAlertModal}
      ></Alertmodal>

      <Row>
        <Col lg="8" md="12" sm="12" className="m-auto mb-5">
          <Form>
            <Row className="mb-3">
              <h1 className="display-4 fw-bold text-blue my-3">
                Write and share
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
                  className="shadow-none border-2 rounded-0"
                />
              </Form.Group>
            </Row>

            <div>
              <Form.Label>Tags</Form.Label>
              <Row className="mb-3 mx-0">
                <Form.Select
                  as={Col}
                  aria-label="Default select example"
                  className=" shadow-none rounded-0 border-2"
                  onChange={handleSelectTag}
                  value={form.tag}
                >
                  <option>Select Tag</option>
                  {tags.map((tag) => (
                    <option key={tag.key} value={tag.value}>
                      {tag.key}
                    </option>
                  ))}
                </Form.Select>
              </Row>
            </div>

            <div>
              <Form.Label>Description</Form.Label>
              <ReactQuill
                ref={quillRef}
                value={value}
                theme="snow"
                onChange={setValue}
                modules={modules}
                formats={formats}
                style={editorStyle}
                className="shadow-none border-2"
              />
            </div>

            <Form.Check
              type="switch"
              id="custom-switch"
              label="Share publicly"
              className="mt-3 fs-4"
              onChange={handleSocialShare}
              checked={form.shared}
              style={{ zIndex: 10 }}
            />

            <Button
              variant="outline-primary"
              className="rounded-0 border-2 px-4 mt-3"
              type="submit"
              onClick={handleSubmit}
              disabled={!form.title}
            >
              {loading ? <Loader /> : postId ? "Edit Post" : "Write Post"}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default WriteNew;
