import './home.scss';
import Modal from 'react-bootstrap/Modal'

import React, { useEffect, useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';

import { connect } from 'react-redux';
import { Row, Col, Alert, Label } from 'reactstrap';

import { AvForm, AvGroup, AvField } from 'availity-reactstrap-validation';

import { createEntity, getEntities } from "app/entities/message/message.reducer";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { convertDateTimeToServer } from "app/shared/util/date-utils";

// export type IHomeProp = StateProps;
export interface IHomeProp extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const Home = (props: IHomeProp) => {
  useEffect(() => {
    props.getEntities();
  }, []);

  const { account, messageList, users, loading } = props;

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const sendMsg = (event, errors, values) => {
    values.publicationDate = convertDateTimeToServer(values.publicationDate);

    if (errors.length === 0) {
      const entity = {
        ...values
      };

      entity.user = account;
      props.createEntity(entity);
    }
  };

  return (
    <Row>
      <Col md="9">
        <h2 id="home-heading">Welcome, Java Hipster!</h2>
        <p className="lead">This is your homepage</p>
        {account && account.login ? (
          <div>
            <Alert id="loggedInMsg" color="success">You are logged in as user {account.login}.</Alert>
            <div>
              <h2 id="message-heading">
                Messages
                <Button id="newMessage" variant="primary" onClick={handleShow} className="btn btn-primary float-right jh-create-entity">
                  <FontAwesomeIcon icon="plus" />
                  Create new message
                </Button>
                <Modal id='newMessageModal' show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>New message</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <AvForm model={{}} onSubmit={sendMsg}>
                      <AvGroup>
                        <Label id="contentLabel" for="message-content">
                          Content
                        </Label>
                        <AvField
                          id="message-content"
                          type="text"
                          name="content"
                          validate={{
                            maxLength: { value: 140, errorMessage: 'This field cannot be longer than 140 characters.' }
                          }}
                        />
                      </AvGroup>
                      <Button variant="secondary" onClick={handleClose}>
                        Cancel
                      </Button>
                      <Button id="save-msg" variant="primary" type="submit" onClick={handleClose}>
                        Send
                      </Button>
                    </AvForm>
                  </Modal.Body>
                </Modal>
              </h2>
              <div className="table-responsive">
                {messageList && messageList.length > 0 ? (
                  <div id="messages">
                    {messageList.sort((a, b) => a.publicationDate > b.publicationDate ? -1 : 1).map((message, i) => (
                      <div key={message.id} className="message-container">
                        <div className="message-username">
                          User: {message.user?.login}
                        </div>
                        <div className="message-content">
                          Message: {message.content}
                        </div>
                        <div className="message-publication-date">
                          Date: {message.publicationDate}
                        </div>
                        <hr></hr>
                      </div>
                    ))}
                  </div>
                ) : (
                  !loading && <div className="alert alert-warning">No Messages found</div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <Alert color="warning">
              If you want to
              <Link to="/login" className="alert-link">
                {' '}
                sign in
              </Link>
              , you can try the default accounts:
              <br />- Administrator (login=&quot;admin&quot; and password=&quot;admin&quot;)
              <br />- User (login=&quot;user&quot; and password=&quot;user&quot;).
            </Alert>

            <Alert color="warning">
              You do not have an account yet?&nbsp;
              <Link to="/account/register" className="alert-link">
                Register a new account
              </Link>
            </Alert>
          </div>
        )}
      </Col>
    </Row>
  );
};

const mapStateToProps = storeState => ({
  account: storeState.authentication.account,
  isAuthenticated: storeState.authentication.isAuthenticated,
  messageList: storeState.message.entities,
  loading: storeState.message.loading,
  users: storeState.userManagement.users,
});

const mapDispatchToProps = {
  getEntities,
  createEntity
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Home);
