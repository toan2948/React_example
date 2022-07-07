import * as React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import withStyles from "@mui/styles/withStyles";
import styles from "./style";
import Button from "@mui/material/Button";
import {withTranslation} from "react-i18next";
import {useEffect} from "react";


function SimpleDialog(props) {
    const { closeDialog, openDialog , t, classes,  handleCancelOrder, orderId, handleOrderSelect } = props;


    return (
        <Dialog open={openDialog}>
            <div className={classes.topLine} />
            <div className={classes.dialogHeader}>
                <p>{t('myOrders:Cancel Button')}</p>
                <img
                    className={classes.cancelIcon}
                    alt="cross"
                    src="/images/icons/X-black.png"
                    onClick={closeDialog}
                />
            </div>
            <p className={classes.question}>{t('myOrders:Cancel Pop-up')}</p>
            <div className = { classes.dialogButton}>
                <Button
                    variant= "cancel"
                    onClick={() => {
                        handleCancelOrder(orderId)
                        handleOrderSelect(orderId)
                        closeDialog()
                    }}
                >
                    {t('myOrders:OK')}
                </Button>
            </div>

        </Dialog>
    );
}

SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};

function CancelDialog(props) {
    const { classes, t, handleCancelOrder, orderId, openDialog, closeDialog, handleOrderSelect } = props;

    return (
        <>
            <SimpleDialog
                openDialog={openDialog}
                closeDialog={closeDialog}
                t = {t}
                handleCancelOrder = {handleCancelOrder}
                orderId = {orderId}
                classes = {classes}
                handleOrderSelect = {handleOrderSelect}
            />
        </>
    );
}
export default withTranslation(['myOrders','accountPage'])(withStyles(styles)(CancelDialog))

