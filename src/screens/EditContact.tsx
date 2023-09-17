import React, {Fragment, useEffect, useState} from 'react';
import HeaderGoBack from '../components/HeaderGoBack/HeaderGoBack';
import { IconButton, TextField } from '@mui/material';
import { Add, Save } from '@mui/icons-material';
import { gql, useMutation, useQuery } from '@apollo/client';
import AlertCommon, { IAlert } from '../components/Alert/Alert';
import { useParams } from 'react-router-dom';

const EditContact = () => {
  const params = useParams();

  const [contact,setContact] = useState({
    first_name: '',
    last_name: '',
    phones: [{
      number: ''
    }]
  });
  const [phones, setPhones] = useState<IPhones[]>([
    {
      number: ''
    }
  ]);
  const [IAlert, setIAlert] = useState<IAlert>({
    alertOpen: false,
    alertHide: () => alertHide(),
    alertMsg: '',
  });
  const alertHide = () => {
      setIAlert({
          ...IAlert,
          alertOpen: false,
      });
  };
  const addPhoneNumber = () => {
    setContact({
      ...contact,
      phones: contact.phones.concat({ number: ''})
    });
  }

  const USER_DETAIL_QUERY = gql`query GetContactDetail($id: Int!){
      contact_by_pk(id: $id) {
      last_name
      id
      first_name
      created_at
      phones {
        number
      }
    }
  }`;

  const UPDATE_USER_QUERY = gql`mutation EditContactById($id: Int!, $_set: contact_set_input) {
    update_contact_by_pk(pk_columns: {id: $id}, _set: $_set) {
      id
      first_name
      last_name
      phones {
        number
      }
    }
  }`;

  const UPDATE_NUMBER_QUERY = gql`mutation EditPhoneNumber($pk_columns: phone_pk_columns_input!, $new_phone_number:String!) {
    update_phone_by_pk(pk_columns: $pk_columns, _set: {number: $new_phone_number}) {
      contact {
        id
        last_name
        first_name
        created_at
        phones {
          number
        }
      }
    }
  }`; 

  const [updateUser, {
    loading: updateUserLoading,
    data: updateUserData,
    error: updateUserError,
  }] = useMutation(UPDATE_USER_QUERY, {
    variables: {
      id: params.id,
      _set: {
        first_name: contact.first_name,
        last_name: contact.last_name
      }
    }
  });

  useEffect(() => {
    if (updateUserData && updateUserData.update_contact_by_pk) {
      setContact(updateUserData.update_contact_by_pk);
      setIAlert({
        ...IAlert,
        alertOpen: true,
        alertMsg: 'Berhasil Mengubah data',
        alertType: 'success',
      })
    }
  }, [updateUserData]);

  useEffect(() => {
    if (updateUserError) {
      setIAlert({
        ...IAlert,
        alertMsg: updateUserError.message,
      })
    }
  }, [updateUserError]);

  const { data } = useQuery(USER_DETAIL_QUERY, {
    variables: {
      id: params.id
    }
  });

  useEffect(() => {
    if (data && data.contact_by_pk) {
      setContact(data.contact_by_pk);
      setPhones(data.contact_by_pk.phones);
    }
  }, [data]);

  const updatePhoneForm = (event: React.ChangeEvent<HTMLInputElement>) => {
    const regex = /^[0-9\b]+$/;
    if (event.target.value === "" || regex.test(event.target.value)) {
      setContact({
        ...contact,
        phones: contact.phones.map((el: IPhones, index: number) => {
          if (index === parseInt(event.target.id)) {
            el.number = event.target.value
          }
          return el;
        })
      })
    } else {
      setIAlert({
        ...IAlert,
        alertOpen: true,
        alertMsg: 'Hanya menerima input angka',
      })
    }
  }

  const handleSave = () => {
    updateUser();
  }

  return (
    <Fragment>
      {IAlert.alertOpen && (<AlertCommon dataAttr={IAlert} />)}
      <HeaderGoBack 
        child={<IconButton
          aria-label="Save"
          onClick={() => { handleSave() }}
          disabled={updateUserLoading}  
        >
          <Save style={{ fontSize: 18, color: '#000000' }} />
        </IconButton>}
      />
      <div style={{ display: 'flex', justifyContent: 'center', padding: 16, background: 'linear-gradient(to right, #b7cced, #a7b3c7)', height: '25vh', borderBottomRightRadius: 80, borderBottomLeftRadius: 80 }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <div style={{padding: '20px'}}>
            <img
              src="https://i2.cdn.turner.com/cnnnext/dam/assets/140926165711-john-sutter-profile-image-large-169.jpg"
              style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', objectPosition: 'center right' }}
              alt="Profile"
            />
          </div>
            <span>Edit Contact</span>
        </div>
      </div>
      <div style={{padding: 10, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <TextField sx={{width: '70%'}} 
          placeholder="First Name"
          style={styles.phoneTextfield}
          value={contact.first_name}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setContact({
              ...contact,
              first_name: event.target.value
            })
          }}
        />
        <TextField sx={{width: '70%'}} 
          placeholder="Last Name"
          style={styles.phoneTextfield}
          value={contact.last_name}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setContact({
              ...contact,
              last_name: event.target.value
            })
          }}
        />
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '70%'}}>
          {
            contact.phones.map((phone: IPhones, index: number) => {
              return (
                <TextField sx={{width: '90%'}} 
                  placeholder={`Phone ${index + 1}`}
                  key={index}
                  id={`${index}`}
                  style={styles.phoneTextfield}
                  value={phone.number}
                  onChange={updatePhoneForm}
                />
              )
            })
          }
          <IconButton onClick={() => { addPhoneNumber() }}>
            <Add />
          </IconButton>
        </div>
      </div>
    </Fragment>
  )
}

const styles = {
  phoneTextfield: {
    margin: 10
  }
}

export default EditContact;