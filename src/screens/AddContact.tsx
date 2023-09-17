import React, {Fragment, useEffect, useState} from 'react';
import HeaderGoBack from '../components/HeaderGoBack/HeaderGoBack';
import UserDefaultIcon from '../assets/user_icon.png';
import { IconButton, TextField } from '@mui/material';
import { Add, Save } from '@mui/icons-material';
import { gql, useMutation } from '@apollo/client';
import AlertCommon, { IAlert } from '../components/Alert/Alert';

const ADD_CONTACT = gql`mutation AddContactWithPhones(
    $first_name: String!, 
    $last_name: String!, 
    $phones: [phone_insert_input!]!
    ) {
  insert_contact(
      objects: {
          first_name: $first_name, 
          last_name: 
          $last_name, phones: { 
              data: $phones
            }
        }
    ) {
    returning {
      first_name
      last_name
      id
      phones {
        number
      }
    }
  }
}`

const AddContact = () => {
  const [newContact,setNewContact] = useState({
    first_name: '',
    last_name: '',
    phones: [{
      number: ''
    }]
  });
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
    setNewContact({
      ...newContact,
      phones: newContact.phones.concat({ number: ''})
    });
  }

  const updatePhoneForm = (event: React.ChangeEvent<HTMLInputElement>) => {
    const regex = /^[0-9\b]+$/;
    if (event.target.value === "" || regex.test(event.target.value)) {
      setNewContact({
        ...newContact,
        phones: newContact.phones.map((el: IPhones, index: number) => {
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

  const [createContact, {
    loading: createContactLoading,
    error: createContactError,
    data: createContactData
  }] = useMutation(ADD_CONTACT, {
    variables: newContact
  })

  const handleSave = () => {
    createContact()
    setNewContact({
      first_name: '',
      last_name: '',
      phones: [{
        number: ''
      }]
    });
  }

  useEffect(() => {
    if (createContactError) {
      setIAlert({
        ...IAlert,
        alertOpen: true,
        alertMsg: createContactError.message
      });
    }
  }, [createContactError]);

  useEffect(() => {
    if (createContactData && createContactData.insert_contact && createContactData.insert_contact.returning) {
      setIAlert({
        ...IAlert,
        alertOpen: true,
        alertMsg: `Berhasil Menambahkan Kontak Baru: ${createContactData.insert_contact.returning[0].first_name} ${createContactData.insert_contact.returning[0].last_name}`,
        alertType: 'success'
      });
    }
  }, [createContactData]);

  return (
    <Fragment>
      {IAlert.alertOpen && (<AlertCommon dataAttr={IAlert} />)}
      <HeaderGoBack 
        child={<IconButton
          aria-label="Save"
          onClick={() => { handleSave() }}
          disabled={createContactLoading}  
        >
          <Save style={{ fontSize: 18, color: '#000000' }} />
        </IconButton>}
      />
      <div style={{ display: 'flex', justifyContent: 'center', padding: 16, background: 'linear-gradient(to right, #b7cced, #a7b3c7)', height: '25vh', borderBottomRightRadius: 80, borderBottomLeftRadius: 80 }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <div style={{padding: '20px'}}>
            <img
              src={UserDefaultIcon}
              style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', objectPosition: 'center right' }}
              alt="Profile"
            />
          </div>
            <span>Add New Contact</span>
        </div>
      </div>
      <div style={{padding: 10, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <TextField sx={{width: '70%'}} 
          placeholder="First Name"
          style={styles.phoneTextfield}
          value={newContact.first_name}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setNewContact({
              ...newContact,
              first_name: event.target.value
            })
          }}
        />
        <TextField sx={{width: '70%'}} 
          placeholder="Last Name"
          style={styles.phoneTextfield}
          value={newContact.last_name}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setNewContact({
              ...newContact,
              last_name: event.target.value
            })
          }}
        />
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '70%'}}>
          {
            newContact.phones.map((phone: IPhones, index: number) => {
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

export default AddContact;