import React, {useEffect} from 'react';

import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';

import classNames from 'classnames';
import styles from './style';
import { withTranslation } from 'react-i18next';
import withStyles from '@mui/styles/withStyles';

import { connectTo } from '../../../../../utils/generic';

import { formatMoney } from '../../../../../utils/localization';
import { getLocaleDateString } from '../../../../../utils/localization';
import { addProduct } from '../../../../../actions/cart';
import CommonTooltip from '../../../../common/Tooltip';

import getShowDiscount from '../../../../../getShowDiscount';
import {Link} from "react-router-dom";
import {closeDeleteUser, deleteUser, openDeleteUser} from "../../../../../actions/account";
import CancelDialog from "../../OrderList/CancelDialog";
const DetailsTableLarge = (props) => {

    const { classes, t, order, settings, handleCancelOrder, handleOrderSelect } = props;
    useEffect(() => {
        console.log('props Table Large', props);
    },[])
    const showDiscount = getShowDiscount(settings)
    return (
      <div className={classes.container} style={{ marginTop: 0 }}>
          {props.deleteOpen &&
          <CancelDialog
              handleCancelOrder={handleCancelOrder}
              orderId={order.orderId}
              openDialog={props.deleteOpen}
              closeDialog = {props.closeDeleteUser}
              handleOrderSelect = {handleOrderSelect}
          />
          }
        <div className={classNames(classes.header, classes.headerRed)}>
          <div className={classes.leftHeader}>
              <div className={classes.headerTitle}>{t('Order Details')}</div>
          <div className={classes.orderDetails}>
            {t('Order Date')} {getLocaleDateString(order.createdAt)} |{' '}
            {t('Order Number')} {order.orderId} | {t('User')}{' '}
            {order.user && order.user.firstName + ' ' + order.user.lastName}
          </div>
          </div>

            {order.status.code === 'pending' &&
                <div>
                    <img
                        className={classNames(classes.cancelIcon, classes.icon)}
                        src = '/images/icons/icon-close.svg'
                        onClick={() => {
                            props.openDeleteUser()
                        }}
                    />
                </div>
           }
        </div>
        <div className={classes.table}>
          <Table style={{ padding: '0 10px' }}>
            <TableHead>
              <TableRow>
                <TableCell className={classes.cellCentred}>
                  {t('Position')}
                </TableCell>
                <TableCell className={classes.cellCentred}>
                  {t('Details')}
                </TableCell>
                {showDiscount && <TableCell />}
                <TableCell className={classes.cellCentred}>
                  {t('Price')}
                </TableCell>
                <TableCell className={classes.cellCentred}>
                  {t('Quantity')}
                </TableCell>
                <TableCell className={classes.cellCentred}>
                  {t('Subtotal')}
                </TableCell>
                <TableCell className={classes.cellCentred} />
              </TableRow>
            </TableHead>
            <TableBody>
              {order.items.map((item, i) => {
                return (
                  <TableRow className={classes.row} key={i} >
                    <TableCell className={classes.cellCentred}>
                      {i + 1}
                    </TableCell>
                    <TableCell
                      className={classNames(
                        classes.nameCell,
                        classes.cellCentred
                      )}
                    >
                            <Link
                                to={item.isOrderable &&`/product/${item.product ? item.product.alias : item.alias}`}
                                style = {{cursor: !item.isOrderable && 'auto'}}
                            >
                            <div className={classes.productName}
                            >
                                {item.productName}
                            </div>
                            <div>
                                {t('Material Number')}: {item.code}
                            </div>
                        </Link>
                    </TableCell>
                     {showDiscount && <TableCell>
                       {item.price !== item.realPrice ? (
                        <div className={classes.notDiscountPrice}>
                          {formatMoney(item.realPrice, order.currency)}
                        </div>
                      ) : null}
                    </TableCell>}
                    <TableCell className={classes.cellCentred}>
                      {item.price !== item.realPrice ? (
                        <div className={classes.discountCol}>
                            <div className={showDiscount ? 'discountPriceWithOriginalPrice': 'discountPrice' }>
                            {formatMoney(item.price, order.currency)}
                          </div>
                            {showDiscount
                               && <div className={classes.discount}>
                                   {t('cart:discount')} {item.discount}%
                                  </div>}
                        </div>
                      ) : (
                        formatMoney(item.price, order.currency)
                      )}
                    </TableCell>

                    <TableCell className={classes.cellCentred}>
                      {item.quantity}
                    </TableCell>
                    <TableCell className={classes.cellCentred}>
                      <div>
                        {formatMoney(
                          item.price * item.quantity,
                          order.currency
                        )}
                      </div>
                    </TableCell>
                    <TableCell className={classes.cellCentred}>
                      <CommonTooltip
                        title={t('tooltips:Re-order')}
                        placement={'top'}
                        enterDelay={300}
                        leaveDelay={200}
                        interactive= "false"
                        enterTouchDelay={100}
                        leaveTouchDelay={3000}
                        disableTouchListener={false}
                        element={
                          item.isOrderable ? (
                            <img
                              onClick={() =>
                                props.addProduct({
                                  code: item.product ? item.product.code : item.code,
                                  quantity: item.quantity,
                                })
                              }
                              className={classNames(classes.available)}
                              src='/images/icons/icon-add-cart.svg'
                            />
                          ) : (
                            <img
                              src='/images/icons/icon-add-cart-unavailable.svg'
                            />
                          )
                        }
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    )
}

export default connectTo(
  (state) => ({
    settings: state.staticContent.settings,
      deleteOpen: state.account.isDeleteUserOpen,

  }),
  {
    addProduct,
      deleteUser,
      openDeleteUser,
      closeDeleteUser,
  },
  withTranslation('myOrders')(withStyles(styles)(DetailsTableLarge))
);
