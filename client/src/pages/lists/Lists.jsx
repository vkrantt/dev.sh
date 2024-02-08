import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import React from "react";
import { useState } from "react";
import { Button, Col, Container, Form, ListGroup, Row } from "react-bootstrap";
import { BASE_URL } from "../../config/config";
import { handleError } from "../../components/handlers/ErrorHandler";
import { useEffect } from "react";
import { get } from "../../components/handlers/storage";
import Loader from "../../components/loader/Loader";

const Lists = () => {
  const [list, setList] = useState("");
  const [lists, setLists] = useState([]);
  const [editList, setEditList] = useState(null);

  // Loaders
  const [loading, setLoading] = useState(false);
  const [isCreateLoading, setIsCreateLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const handleInputChange = (event) => {
    setList(event.target.value);
  };

  useEffect(() => {
    getAllLists();
  }, []);

  function getAllLists() {
    setLoading(true);
    axios
      .get(`${BASE_URL}/list`, {
        headers: {
          "Content-Type": "application/type",
          Authorization: `Bearer ${get("dsh_token")}`,
        },
      })
      .then((data) => {
        setLists(data.data.response);

        setLoading(false);
      })
      .catch((error) => {
        handleError(error);
        setLoading(false);
      });
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (list === "") return;
    if (editList) {
      // edit
      editApiForlist();
    } else {
      // create
      setIsCreateLoading(true);
      axios
        .post(
          `${BASE_URL}/list/create`,
          {
            name: list,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${get("dsh_token")}`,
            },
          }
        )
        .then((response) => {
          setLists((prev) => [...prev, response.data.response]);
          setList("");
          setIsCreateLoading(false);
        })
        .catch((error) => {
          handleError(error);
          setIsCreateLoading(false);
        });
    }
  };

  const handleEdit = (list) => {
    setEditList(list);
    setList(list.name);
  };

  function editApiForlist() {
    setIsCreateLoading(true);
    axios
      .put(
        `${BASE_URL}/list/edit/${editList._id}`,
        {
          name: list,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${get("dsh_token")}`,
          },
        }
      )
      .then((response) => {
        setList("");
        setEditList(null);
        setIsCreateLoading(false);
        getAllLists();
      })
      .catch((error) => {
        handleError(error);
        setIsCreateLoading(false);
      });
  }

  const handleDelete = (list) => {
    const consent = window.confirm("Are you sure");
    if (consent) {
      setIsDeleteLoading(true);
      axios
        .delete(`${BASE_URL}/list/delete/${list._id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${get("dsh_token")}`,
          },
        })
        .then((response) => {
          setEditList(null);
          setIsDeleteLoading(false);
          getAllLists();
        })
        .catch((error) => {
          handleError(error);
          setIsDeleteLoading(false);
        });
    }
  };
  return (
    <Container>
      <Row className="d-flex flex-md-row-reverse">
        <Col lg="8" md="12" sm="12" className="m-auto mb-5">
          <h1 className="display-4 fw-bold text-light-blue">Lists</h1>
          <div className="d-flex align-items-center justify-content-between">
            <div className="flex-grow-1">
              <Form.Group>
                <Form.Control
                  name="search"
                  onChange={handleInputChange}
                  value={list}
                  type="text"
                  placeholder="List name"
                  className="shadow-none border-0 text-light bg-dark rounded-1"
                />
              </Form.Group>
            </div>

            <Button
              variant="outline-primary"
              type="button"
              className="rounded-1 border-2 px-4"
              onClick={handleSubmit}
            >
              {isCreateLoading ? (
                <Loader size="sm" />
              ) : editList ? (
                "Edit List"
              ) : (
                "Add List"
              )}
            </Button>

            {editList && (
              <Button
                variant="outline-secondary"
                type="button"
                className="rounded-1 border-2 px-4"
                onClick={() => {
                  setEditList(null);
                  setList("");
                }}
              >
                Cancel
              </Button>
            )}
          </div>

          {loading && (
            <div className="text-center my-4">
              <Loader />
            </div>
          )}
          {!lists.length && !loading && (
            <div className="text-center my-4">No results found</div>
          )}

          {lists.length > 0 && !loading && (
            <div>
              <div className="text-light-blue mt-5 mb-2">All Lists</div>
              <ListGroup>
                {lists.map((list, i) => (
                  <ListGroup.Item
                    key={i}
                    className="d-flex bg-dark border-0 border-2 border-secondary rounded-0 border-bottom text-light align-items-center justify-content-between"
                  >
                    <h6>{list.name}</h6>

                    <div className="d-flex gap-1">
                      <Button
                        variant="secondary"
                        className="d-flex justify-content-center align-items-center"
                        type="button"
                        size="sm"
                        onClick={() => handleEdit(list)}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="danger"
                        className="d-flex justify-content-center align-items-center"
                        type="button"
                        size="sm"
                        onClick={() => handleDelete(list)}
                      >
                        {isDeleteLoading ? (
                          <Loader variant="light" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Lists;
