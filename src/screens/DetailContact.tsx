import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, ListItemIcon, Menu, MenuItem } from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderGoBack from '../components/HeaderGoBack/HeaderGoBack';
import IconButton from "@mui/material/IconButton";
import { StarBorder, Star, MoreVert, Phone, Videocam, Sms, Mail, Delete, Edit } from "@mui/icons-material";
import { gql, useMutation, useQuery } from '@apollo/client';
import './Dialog.scss';
import AlertCommon, { IAlert } from '../components/Alert/Alert';

const DetailContact = () => {
  const params = useParams();
  const navigate = useNavigate();

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
  }`

  const DELETE_CONTACT = gql`mutation MyMutation($id: Int!) {
    delete_contact_by_pk(id: $id) {
      first_name
      last_name
      id
    }
  }`;

  const { loading, error, data } = useQuery(USER_DETAIL_QUERY, {
    variables: {
      id: params.id
    }
  });
  
  const [favorite, setFavorite] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [contact, setContact] = useState<IContact>();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

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

  const [deleteContact, {
    loading: deleteContactLoading,
    error: deleteContactError,
    data: deleteContactData
  }] = useMutation(DELETE_CONTACT, {
    variables: {
      id: contact?.id
    }
  });

  const dialogHide = () => {
    setDialogOpen(!dialogOpen);
  }

  const dialogOk = () => {
    deleteContact();
  }

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleDelete = () => {
    handleClose();
    setDialogOpen(!dialogOpen);
  }

  const handleEdit = () => {
    handleClose();
    navigate(`/edit/${params.id}`)
  }

  const handleSetting = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFav = () => {
    const favorites = JSON.parse(localStorage.getItem("favContacts") || "[]");
    if (favorite) {
      const favIndex = favorites.findIndex((el: IContact) => el.id === contact?.id);
      favorites.splice(favIndex, 1);
    } else {
      favorites.push(contact);
    }
    localStorage.setItem("favContacts", JSON.stringify(favorites));
    setFavorite(!favorite);
  }

  useEffect(() => {
    setDialogOpen(false);
    if (deleteContactData && deleteContactData.delete_contact_by_pk && deleteContactData.delete_contact_by_pk.first_name) {
      setIAlert({
        ...IAlert,
        alertOpen: true,
        alertMsg: `Berhasil menghapus kontak ${deleteContactData.delete_contact_by_pk.first_name} ${deleteContactData.delete_contact_by_pk.last_name}`,
        alertType: 'success'
      });
      setTimeout(() => {
        navigate('/')
      }, 1000);
    } else if (deleteContactError) {
      setIAlert({
        ...IAlert,
        alertOpen: true,
        alertMsg: deleteContactError.message
      });
    }
  }, [deleteContactLoading, deleteContactData]);

  useEffect(() => {
    if (data && data.contact_by_pk) {
      setContact(data.contact_by_pk);
    } 
    // else {
    //   setIAlert({
    //     ...IAlert,
    //     alertOpen: true,
    //     alertMsg: 'Kontak Tidak Ditemukan, Kembali ke halaman utama...'
    //   });
    //   setTimeout(() => {
    //     navigate('/');
    //   }, 1000)
    // }
  }, [data]);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favContacts") || "[]");
    for (let i = 0; i < favorites.length; i++) {
      if (favorites[i].id === contact?.id) {
        setFavorite(true);
      }
    }
  }, [contact])

  const ContactCard = () => {
    return (
      <Box width="100%">
        {IAlert.alertOpen && (<AlertCommon dataAttr={IAlert} />)}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <div style={{padding: '10px'}}>
            <img
              src="https://i2.cdn.turner.com/cnnnext/dam/assets/140926165711-john-sutter-profile-image-large-169.jpg"
              style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', objectPosition: 'center right' }}
              alt="Profile"
            />
          </div>
          <div style={{margin: 10}}>
            {`${contact?.first_name} ${contact?.last_name}`}
          </div>
          {contact?.phones.map((phone_number: IPhones, index: number) => {
            return (
              <div key={index} style={{display: 'flex', flexDirection: 'column', width: '50%'}}>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                  <span style={{margin: 8}}>Phone Number {index+1}</span>
                  <span style={{margin: 8}}>{phone_number.number}</span>
                </div>
              </div>
            )
          })}
        </div>
      </Box>
    )
  }

  const ActionButton = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', margin: 20}}>
        <div style={{display: 'flex', flexDirection: 'row',  justifyContent: 'space-around', width: '30%'}}>
          <IconButton
            aria-label="Phone"
            style={styles.iconButton}
            onClick={() => { }}>
            <Phone style={styles.actionIcon} />
          </IconButton>
          <IconButton
            aria-label="Video Call"
            style={styles.iconButton}
            onClick={() => { }}>
            <Videocam style={styles.actionIcon} />
          </IconButton>
          <IconButton
            aria-label="Sms"
            style={styles.iconButton}
            onClick={() => { }}>
            <Sms style={styles.actionIcon} />
          </IconButton>
          <IconButton
            aria-label="Mail"
            style={styles.iconButton}
            onClick={() => { }}>
            <Mail style={styles.actionIcon} />
          </IconButton>
        </div>
      </div>
    )
  }

  const DeleteConfirmation = () => {
    return (
      <Dialog
          open={dialogOpen}
          onClose={dialogHide}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className="box-dialog"
          fullWidth
      >
        <DialogContent>
            <DialogContentText id="alert-dialog-description" sx={{ textAlign: 'center', padding: '0 10px', fontFamily: 'TruenoLt' }}>
              Apakah Anda yakin menghapus kontak ini? <br></br>Nama: {`${contact?.first_name} ${contact?.last_name}`}
            </DialogContentText>
        </DialogContent>

        <DialogActions
            sx={{ display: "flex", justifyContent: "space-around", padding: '20px 0 ' }}
        >
              <Button
                className="btn-ok"
                onClick={() => dialogOk()}
              >
                Ya
              </Button>
              <Button
                className="btn-close"
                onClick={() => dialogHide()}
              >
                Tidak
              </Button>
        </DialogActions>
      </Dialog>
    )
  }

  const MenuDropdown = () => {
    return (
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon style={{color: 'red'}}>
            <Delete fontSize="small" />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
    )
  }


  return (
    <Fragment>
      <HeaderGoBack child={
        <div>
        {
          favorite ?
          (
            <IconButton
              aria-label="StarIcon"
              onClick={() => { handleFav() }}>
              <Star style={{ fontSize: 18, color: '#FFD700' }} />
            </IconButton>
          ) : 
          (
            <IconButton
              aria-label="StarIcon"
              onClick={() => { handleFav() }}>
              <StarBorder style={{ fontSize: 18, color: '#000000' }} />
            </IconButton>
          )
        }
        <IconButton
          aria-label="More Menu"
          onClick={handleSetting}>
          <MoreVert style={{ fontSize: 18, color: '#000000' }} />
        </IconButton>
        <MenuDropdown />
      </div>
      } />
      <div style={{ display: 'flex', justifyContent: 'center', padding: 16, background: 'linear-gradient(to right, #7b8ebd, #687ca8)', borderBottomRightRadius: 80, borderBottomLeftRadius: 80 }}>
        <ContactCard />
      </div>
      <ActionButton />
      <DeleteConfirmation />
    </Fragment>
  )
}

const styles = {
  actionIcon: {
    fontSize: 18,
    color: '#034efc',
  },
  iconButton: {
    background: 'radial-gradient(circle at 18.7% 37.8%, rgb(250, 250, 250) 0%, rgb(225, 234, 238) 90%)'
  }
}


export default DetailContact;