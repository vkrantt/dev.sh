import React from "react";
import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./WriteNew.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BASE_URL, toastConfig } from "../../config/config";
import axios from "axios";
import { get } from "../../components/handlers/storage";
import { useEffect } from "react";
import Loader from "../../components/loader/Loader";
import Alertmodal from "../../modals/alert/Alertmodal";
import { tags } from "../../components/json/tags";
import { handleError } from "../../components/handlers/ErrorHandler";
import toast, { Toaster } from "react-hot-toast";
import { X } from "lucide-react";

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
    list: "",
  });
  const [postFromId, setPostFromId] = useState();
  const [isListLoading, setIsListLoading] = useState(false);
  const [Lists, setLists] = useState([]);

  useEffect(() => {
    setIsListLoading(true);
    axios
      .get(`${BASE_URL}/list`, {
        headers: {
          "Content-Type": "application/type",
          Authorization: `Bearer ${get("dsh_token")}`,
        },
      })
      .then((data) => {
        setLists(data.data.response);
        setIsListLoading(false);
      })
      .catch((error) => {
        handleError(error);
        setIsListLoading(false);
      });
  }, []);

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
            list: data.list,
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

  const handleSelectList = (e) => {
    setForm({
      ...form,
      list: e.target.value,
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
    if (!form.title || !form.description || !form.tag || !value) {
      setShowAlertModal(true);
      setAlertMessage("Please fill all the required fields");
      return;
    }
    if (form.list === "") delete form.list;
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
              toast.success(
                "Post updated, Please wait for the approval.",
                toastConfig
              );
            } else {
              setForm({
                title: "",
                description: "",
                tag: "",
                shared: false,
                list: "",
              });
              setValue("");
              quillRef.current.value = "";
              toast.success(
                "Post submitted, Please wait for the approval.",
                toastConfig
              );
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
        icon={<X size={50} color="red" style={{ marginBottom: "20px" }} />}
      ></Alertmodal>

      <Row>
        <Col lg="8" md="12" sm="12" className="m-auto mb-5">
          <Form>
            <Row className="mb-3">
              <h1 className="display-4 fw-bold text-light-blue my-3">
                Write and share
              </h1>
            </Row>
            <Row className="mb-3">
              <Form.Label>
                Title <span className="text-danger">*</span>
              </Form.Label>
              <Form.Group as={Col}>
                <Form.Control
                  type="text"
                  name="title"
                  onChange={handleChange}
                  value={form.title}
                  className="shadow-none border-0 rounded-1 bg-dark text-light"
                />
              </Form.Group>
            </Row>

            <Row>
              <Col lg="6">
                <Form.Label>
                  Tags <span className="text-danger">*</span>{" "}
                </Form.Label>
                <Row className="mb-3 mx-0">
                  <Form.Select
                    as={Col}
                    aria-label="Default select example"
                    className=" shadow-none rounded-1 border-0 bg-dark text-light"
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
              </Col>
              <Col lg="6">
                <Form.Label>Select List</Form.Label>
                <Row className="mb-3 mx-0">
                  <Form.Select
                    as={Col}
                    aria-label="Default select example"
                    className=" shadow-none rounded-1 border-0 bg-dark text-light"
                    onChange={handleSelectList}
                    value={form.list}
                  >
                    <option value="">Select List</option>
                    {Lists.map((list, i) => (
                      <option key={i} value={list._id}>
                        {list.name}
                      </option>
                    ))}
                  </Form.Select>
                </Row>
              </Col>
            </Row>

            <div>
              <Form.Label>
                Description <span className="text-danger">*</span>
              </Form.Label>
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
            />

            <Button
              variant="outline-primary"
              className="rounded-1 border-2 px-4 mt-3"
              type="submit"
              onClick={handleSubmit}
              disabled={!form.title}
            >
              {loading ? (
                <Loader variant="light" />
              ) : postId ? (
                "Update Post"
              ) : (
                "Write Post"
              )}
            </Button>
          </Form>
        </Col>
      </Row>
      <Toaster />
    </Container>
  );
};

export default WriteNew;
