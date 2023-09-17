import React, {Fragment, useEffect, useState} from 'react';
import { CircularProgress, Divider, TextField, Box, IconButton} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Add from '@mui/icons-material/Add';
import Search from '@mui/icons-material/Search';
import { useNavigate } from "react-router-dom";
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import AlertCommon, { IAlert } from '../components/Alert/Alert';

const CONTACT_QUERY = gql`query GetContactList (
  $where: contact_bool_exp
) {
contact(
    where: $where
){
  created_at
  first_name
  id
  last_name
  phones {
    number
  }
}
}`

const ContactList = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<IContact[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResult, setSearchResult] = useState<IContact[]>([]);
  const [favorites, setFavorites] = useState<IContact[]>([]);

  const { loading, error, data, refetch } = useQuery(CONTACT_QUERY, {
    variables: {
      where: {
        "first_name": {"_like": `%${searchQuery}%` }
      }
    }
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

  const listContact = [
    {
      id: 1,
      name: 'Angelina',
      phone_number: '080803183'
    },
    {
      id: 2,
      name: 'Christy',
      phone_number: '081231321'
    }
  ]

  useEffect(() => {
    if (data && data.contact) {
      let sort_contacts = [...data.contact];
      sort_contacts = sort_contacts.sort((a: IContact,b: IContact) => (a.first_name.toLowerCase() > b.first_name.toLowerCase()) ? 1 : ((b.first_name.toLowerCase() > a.first_name.toLowerCase()) ? -1 : 0))
      let favorites = JSON.parse(localStorage.getItem("favContacts") || "[]")
      favorites.map((el: IContact) => {
        const favIndex = sort_contacts.findIndex((contact: IContact) => el.id === contact.id);
        sort_contacts.splice(favIndex, 1);
        return el;
      })
      setFavorites(favorites)
      setContacts(sort_contacts);
    }
    if (error) {
      setIAlert({
        ...IAlert,
        alertOpen: true,
        alertMsg: error.message
      })
    }
  }, [data, error]);

  const viewDetail = (id: number) => {
    navigate(`/${id}`);
  }

  const addContact = () => {
    navigate('/add');
  }

  const handleSearch = (value: string) => {
    refetch()
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => { 
    setSearchQuery(event.target.value);
  }

  const HeaderMenu = () => {
      return (
          <div style={{ margin: 20, alignItems: 'center', display: 'flex', justifyContent: 'space-between' }} >
              <div style={{display: 'flex', flex: 1, flexDirection: 'column', alignContent: 'center'}}>
                <span style={{ width: '60%', color: '#FFFFFF', fontFamily: 'TruenoLt' }} >Contact List</span>
              </div>
              <IconButton style={{ color: 'white'}} onClick={() => {addContact()}}>
                <Add />
              </IconButton>
          </div>
      );
  };

  const AllContact = () => {
    return (
      <div style={{marginTop: 30}}>
        <span>All Contact</span>
        {loading && <CircularProgress style={{ lineHeight: 0, margin: 10 }} size={25} />}
        {
          contacts.length ? (
            <>
              <div style={{display: 'flex', flexDirection: 'column'}}>
                {contacts.map((contact: IContact) => {
                  return (
                    <ContactItem 
                      key={contact.id}
                      id={contact.id}
                      first_name={contact.first_name}
                      phones={contact.phones}
                      last_name={contact.last_name}
                      created_at={contact.created_at}
                    />
                  )
                })}
              </div>
            </>
          ) : (
            <div style={{marginTop: 20}}>
              <span>Contact tidak ditemukan</span>
            </div>
          )
        }
      </div>
    )
  }

  const FavContact = () => {
    return (
      <div style={{marginTop: 30}}>
        <span>Favorite Contact</span>
        {
          favorites.length ? (
            <>
              <div style={{display: 'flex', flexDirection: 'column'}}>
                {favorites.map((contact: IContact) => {
                  return (
                    <ContactItem 
                      key={contact.id}
                      id={contact.id}
                      first_name={contact.first_name}
                      phones={contact.phones}
                      last_name={contact.last_name}
                      created_at={contact.created_at}
                    />
                  )
                })}
              </div>
            </>
          ) : (
            <div style={{marginTop: 30}}>
              <span>Belum ada Kontak Favorit</span>
            </div>
          )
        }
      </div>
    )
  }

  const ContactItem = (props: IContact) => {
    return (
      <div style={{ cursor: 'pointer', boxShadow: '0px 4px 8px 0px #60617029', padding: 10, marginBottom: 10, backgroundColor: '#FFFFFF', borderRadius: 10 }} onClick={() => viewDetail(props.id)} >
        <div style={{ display: 'flex', flexDirection: 'row', position: 'relative'}}>
            <div style={{marginRight: 20, marginTop: 10}}>
              <AccountCircle
                fontSize="large"
              />
            </div>
            <div style={{width: '100%'}}>
              <div style={{padding: 5}}>
                <span style={{fontSize: '14px'}}>{`${props.first_name} ${props.last_name}`}</span>
              </div>
              <Divider style={{marginRight: -10, marginLeft: -10}} />
              <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '10px', padding: 5}}>
                <span>Phone Number</span>
                <span>{props.phones[0].number}</span>
              </div>
            </div>
        </div>
      </div>
    )
  }

  return (
      <Fragment>
        {IAlert.alertOpen && (<AlertCommon dataAttr={IAlert} />)}
        <div style={{ background: 'linear-gradient(to right, #7b8ebd, #687ca8)', height: 167, borderBottomRightRadius: 20, borderBottomLeftRadius: 20 }} />
        <div style={{ marginTop: -147 }}>
            <HeaderMenu />
            <div style={{margin: 20}}>
              <div style={{ display: 'flex', justifyContent: 'center', boxShadow: '0px 4px 8px 0px #60617029', padding: 8, backgroundColor: '#FFFFFF', borderRadius: 10, }} >
                <Box sx={{ width: '100%', display: 'flex', alignItems: 'flex-end' }}>
                  <IconButton sx={{ mr: 1, my: 0.5 }} onClick={() => {handleSearch(searchQuery)}}>
                    <Search />
                  </IconButton>
                  <TextField
                    fullWidth
                    size="small"
                    id="input-with-sx"
                    label="Search Contact"
                    variant="standard"
                    value={searchQuery}
                    onChange={handleInputChange}
                    onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                      if (event.key === "Enter") {
                        handleSearch(searchQuery)
                      }
                    }}
                  />
                </Box>
              </div>
              <FavContact />
              <AllContact />
            </div>
        </div>
      </Fragment >
  );

};

export default ContactList;