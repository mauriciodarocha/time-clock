import { Context, useContext } from "react";
import { User } from "../../../models/Users";
import { StoreContext } from "../../../store/Store";

export interface TimeClockAdminProps {}
 
const TimeClockAdmin: React.FunctionComponent<TimeClockAdminProps> = () => {
    const contextUser = useContext(StoreContext as Context<[User,Function]>)
    const showAdmin = (): JSX.Element => {
        const [user] = contextUser
        if (user && ['admin'].includes(user.user_level)) {
            return (
                <div>
                    <h1>
                    time clock admin
                    </h1>
                </div>                
            )
        }
        return (
            <div>
                <h1>NOT ALLOWED!</h1>
            </div>
        )
    }
    return (
        <>
            {showAdmin()}
        </>
    );
}
 
export default TimeClockAdmin;