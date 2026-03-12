import React from "react";

import { FlexGrid, FlexGridItem } from "baseui/flex-grid";
import { Button, SIZE as ButtonSize } from "baseui/button";
import { Input, SIZE as InputSize } from "baseui/input";
import { FormControl } from "baseui/form-control";
import { ParagraphLarge } from "baseui/typography";
import { styled } from "styletron-react";

import { PROFILE_MANAGER_PATH } from "../../../AppPaths";
import { useUserPut } from "../../../hooks/auth/useUserPut";

import { setToken } from "../../utils";

import ManagerSubPage from "../ManagerSubPage";


const SectionTitleUI = styled(ParagraphLarge, {
    fontWeight: 600,
    borderBottom: '1px solid #eeeeee',
});


const ProfileManager = () => {

    const user = JSON.parse(sessionStorage.getItem('user'));

    console.log(user);

    const [username, setUserName] = React.useState(user['username']);
    const [email, setEmail] = React.useState(user['email']);
    const [firstName, setFirstName] = React.useState(user['firstName']);
    const [lastName, setLastName] = React.useState(user['lastName']);

    const [formErrors, setFormErrors] = React.useState({});

    const { mutateAsync: updateProfileRequest, isLoading } = useUserPut();

    const onSaveClick = async () => {
        try {
            const resp = await updateProfileRequest({
                "username": username,
                "firstName": firstName,
                "lastName": lastName,
                "email": email
            });
            setToken(resp);
            window.location.reload();
        } catch(error) {
            setFormErrors({"username": "Username already taken"})
        }
    };

    const validateAndSave = () => {
        const usernameFormat = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        const emailFormat = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
        const requiredMessage = "This field is required"
        let errors = {}

        if (username === ""){
            errors["username"] = requiredMessage;
        }
        if (usernameFormat.test(username) || username.includes(" ")){
            errors["username"] = "Username can't have any special characters or empty spaces!";
        }
        if (!emailFormat.test(email)) {
            errors["email"] = "Not a valid e-mail!"
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        onSaveClick();
    };

    return (
        <ManagerSubPage 
            activeItem={PROFILE_MANAGER_PATH}
            itemTitle={"Profile"}
        >
            
            <SectionTitleUI>Update Personal Information</SectionTitleUI>
            <FlexGrid flexGridColumnCount={2} flexGridColumnGap={'5px'}>
                <FlexGridItem>
                    <FormControl 
                        error={"username" in formErrors ? formErrors["username"] : null}
                    >
                        <Input
                            value={username}
                            onChange={e => setUserName(e.target.value)}
                            placeholder="Username"
                            size={InputSize.compact}
                        />
                    </FormControl>
                </FlexGridItem>
                <FlexGridItem>
                    <FormControl 
                        error={"email" in formErrors ? formErrors["email"] : null}
                    >
                        <Input
                            clearable
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="E-mail"
                            type="email"
                            size={InputSize.compact}
                        />
                    </FormControl>
                </FlexGridItem>
            </FlexGrid>
            <FlexGrid flexGridColumnCount={2} flexGridColumnGap={'5px'}>
                <FlexGridItem>
                    <FormControl 
                        error={"firstName" in formErrors ? formErrors["firstName"] : null}
                    >
                        <Input
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            placeholder="First Name"
                            size={InputSize.compact}
                        />
                    </FormControl>
                </FlexGridItem>
                <FlexGridItem>
                    <FormControl 
                        error={"lastName" in formErrors ? formErrors["lastName"] : null}
                    >
                        <Input
                            clearable
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            placeholder="Last Name"
                            size={InputSize.compact}
                        />
                    </FormControl>
                </FlexGridItem>
            </FlexGrid>
            <Button 
                type={'submit'} 
                onClick={() => validateAndSave()} 
                isLoading={isLoading}
                size={ButtonSize.compact}
            >
                Save
            </Button>
            
        </ManagerSubPage>
    );
};

export default ProfileManager;