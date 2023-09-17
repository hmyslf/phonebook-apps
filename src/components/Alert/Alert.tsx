import React, { Fragment } from "react";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Alert, { AlertColor } from '@mui/material/Alert';
import './Alert.scss';
import { Snackbar, Stack } from '@mui/material';

export interface IAlert {
    alertOpen?: boolean,
    alertHide?: () => void,
    alertMsg?: string,
    alertType?: AlertColor;
}

export const initialIAlert: IAlert = {
    alertOpen: false,
    alertHide: () => null,
    alertMsg: '',
    alertType: 'info',
};

export interface Props {
    dataAttr: IAlert,
}

const AlertCommon = (props: Props) => {
    const { alertOpen, alertHide, alertMsg, alertType } = props.dataAttr;

    return (
        <Fragment>
            <Stack sx={{ maxWidth: '100%' }}>
                <Snackbar open={alertOpen} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} autoHideDuration={6000} onClose={alertHide} >
                    <Alert
                        className={`box-alert ${alertType}`}
                        severity={alertType ? alertType : "warning"}
                        action={<IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                if (alertHide) {
                                    alertHide();
                                }
                            }}
                        ><CloseIcon fontSize="inherit" /></IconButton>}
                    >
                        {alertMsg}
                    </Alert>
                </Snackbar>
            </Stack>
        </Fragment>
    );
};

export default AlertCommon;
