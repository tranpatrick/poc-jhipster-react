import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IUser } from 'app/shared/model/user.model';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { getEntity, updateEntity, createEntity, reset } from './message.reducer';
import { IMessage } from 'app/shared/model/message.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IMessageUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const MessageUpdate = (props: IMessageUpdateProps) => {
  const [userId, setUserId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { messageEntity, users, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/message');
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getUsers();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    values.publicationDate = convertDateTimeToServer(values.publicationDate);

    if (errors.length === 0) {
      const entity = {
        ...messageEntity,
        ...values
      };
      entity.user = users[values.user];

      if (isNew) {
        props.createEntity(entity);
      } else {
        props.updateEntity(entity);
      }
    }
  };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="halitranApp.message.home.createOrEditLabel">Create or edit a Message</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : messageEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="message-id">ID</Label>
                  <AvInput id="message-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
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
              <AvGroup>
                <Label id="publicationDateLabel" for="message-publicationDate">
                  Publication Date
                </Label>
                <AvInput
                  id="message-publicationDate"
                  type="datetime-local"
                  className="form-control"
                  name="publicationDate"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.messageEntity.publicationDate)}
                />
              </AvGroup>
              <AvGroup>
                <Label for="message-user">User</Label>
                <AvInput id="message-user" type="select" className="form-control" name="user">
                  <option value="" key="0" />
                  {users
                    ? users.map((otherEntity, index) => (
                        <option value={index} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/message" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">Back</span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp; Save
              </Button>
            </AvForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  users: storeState.userManagement.users,
  messageEntity: storeState.message.entity,
  loading: storeState.message.loading,
  updating: storeState.message.updating,
  updateSuccess: storeState.message.updateSuccess
});

const mapDispatchToProps = {
  getUsers,
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(MessageUpdate);
