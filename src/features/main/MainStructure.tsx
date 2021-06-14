import React, { Dispatch, SetStateAction, useContext } from 'react';
import { BrowserRouter, Link, Route } from 'react-router-dom';
import { User } from '../../models/Users';
import { StoreContext, IStoreContext } from '../../store/Store';
import TimeClockHome from '../time-clock/home/TimeClockHome';
import TimeClockClock from '../time-clock/clock/TimeClockClock';
import TimeClockAdmin from '../time-clock/admin/TimeClockAdmin';
 
const MainStructure: React.FunctionComponent = (): JSX.Element => {
    const contextUser = useContext<IStoreContext|Dispatch<SetStateAction<IStoreContext>>|unknown>(StoreContext)
    const menuLinks = (): JSX.Element => {
        const [user] = contextUser as User[];
        return (
            <div className='links d-flex justify-content-end'>
                <span>
                    <Link className={'home-lnk link'} to='/'>Home</Link>
                </span>
                <span>
                    <Link className={'clock-lnk link'} to='/time-clock'>Clock</Link>
                </span>
                { user && ['admin'].includes(user.user_level) && 
                    <span>
                        <Link className={'admin-lnk link'} to='/time-clock/admin'>Admin</Link>
                    </span>
                }
            </div>
        )
    }
    return (
        <BrowserRouter>
            <div className="main-structure">
                <header className="container-fluid">
                    <div className="row">
                        <div className="logo col-md-5 py-md-3 d-md-flex align-items-center flex-row justify-content-md-end">
                            <Link to='/' className="logo-lnk">
                                <img className="logo-img" src={process.env.PUBLIC_URL + '/assets/time-clock-logo.png'} alt='Time Clock Logo' />
                            </Link>
                        </div>
                        <div className="menu col pt-md-3 d-flex flex-md-column flex-row-reverse justify-content-center">
                            <div className="help d-flex justify-content-md-end pr-md-1">
                                <Link to="" className="help-btn">
                                    <img className="help-icon-img" src={process.env.PUBLIC_URL + '/assets/help-icon.png'} alt='Help icon' />
                                </Link>
                            </div>
                            {menuLinks()}
                        </div> 
                    </div>
                </header>
                <div className="main container-fluid">
                    <Route path='/' exact={true} component={TimeClockHome} />
                    <Route path='/time-clock' exact={true} component={TimeClockClock} />
                    <Route path='/time-clock/admin' exact={true} component={TimeClockAdmin} />
                </div>
            </div>
        </BrowserRouter>
    );
}
 
export default MainStructure;