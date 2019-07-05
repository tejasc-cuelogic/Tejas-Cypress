### Master Inventory NS-Client

**Note:** Date format need to be **mm/dd/yyyy**


- API
	- Investor
		- [X] Matching `seedTestUsers` data values with `getMigratedUserAuditInfo` data (Date : **07-04-2018** | By **Chetan and Pratik**)


- Authentication
	- Login
		- [ ] Invalid Email Address/ Invalid Password
		- [X] Invalid Email Address/ valid Password (Date : **07-04-2018**)
		- [ ] Valid email address/ invalid password
	- Login with migrated user
		- [ ] Migrated full (should display confirm phone screen)
		- [ ] Migrated partial (should go to incomplete steps i.e go to email verification if it is not verified) 
	- Forgot Password
		- [ ] Invalid email
		- [ ] Incorrect Verification Code
		- [ ] Correct Verification Code
		- [ ] Password mismatch
		- [ ] Weak Password Strength Reset
		- [ ] Successful Reset

- Investor Signup
	- Basic
		-  Email
			- [ ] Duplicate email address
			- [ ] Invalid email address
			- [ ] Invalid password
			- [ ] Password mismatch
			- [ ] Password strength
			- [ ] Valid Email with correct MFA Code
			- [ ] Valid Email with incorrect MFA Code
			- [ ] Change email address
			- [ ] Resend MFA to Email
		- CIP
			- [ ] Entered Business Address
			- [ ] Entered Business Address with ByPassAddressCheckFlag
	        - [X] Deny Business Address (Date : **07-04-2018** | By **Swapnil**)
			- [ ] Entered an invalid age
			- [ ] Duplicate SSN
			- [ ] Invalid Phone Number
			- [X] CIP Submit and Pass (Date : **07-04-2018** | By **Swapnil**)
			- CIP Submit and Fail with Questions
				- [ ] Correct Answers
				- [ ] Incorrect Answers
			- CIP Submit and Fail with Uploads
				- [ ] Upload with invalid filename
				- [ ] Submit with Upload
				- [ ] Clean / good upload
		
		- Phone MFA
			- [ ] Text
			- [ ] Resend Text
			- [ ] Call
			- [ ] Resend Call
			- [ ] Incorrect Code
			- [ ] Correct Code
	- [ ] Investor Profile Questions

- Individual Account
	- Link Bank
		- [X] Link bank directly (Date : **07-04-2018** | By **Swapnil**)
		- [ ] Search bank
		- [ ] Change linked bank
		- [ ] keep existing linked bank
	- Link bank manually
		- [ ] Wrong routing number
		- [ ] Wrong account number
		- [X] Successful link bank manually (Date : **07-04-2018** | By **Swapnil**)
	- Add funds
		- [ ] I don't want to deposit any money
		- [ ] Add fund below $100
		- [X] Create account (Date : **07-04-2018** | By **Swapnil**)

- IRA Account
	- Link Bank
		- [ ] Link bank directly
		- [ ] Search bank
		- [ ] Change linked bank
		- [ ] keep existing linked bank
	- Add funds
		- [ ] I don't want to deposit any money
		- [ ] Add fund below $5000
		- [ ] Add fund above $6000
		- [ ] Create account
	- Upload file
		- [ ] Upload with invalid filename
		- [ ] Remove uploaded files
	- [ ] Switch to account type and funding tab from summary page, change account type and funding options
	- [ ] Check hyperlinks (Summary page)
	- [X] Create account (Date : **07-04-2018** | By **Swapnil**)

- Entity Account
	- [ ] Check Investment Limit
	- [ ] Duplicate TAX ID
	- [ ] Invalid zip code
	- [ ] Switch between tabs, change options
	- [ ] Upload with invalid filename
	- [ ] Remove uploaded files
	- [ ] Add fund below $5000
    - [X] Account Creation (Date : **07-04-2018** | By **Swapnil**)

- Deposit Funds
	- [ ] Add funds
	- [ ] Chnage amount 
	- [ ] Cancel add funds
	- [ ] Withdraw funds
	- [ ] Available cash, total balance and net deposit

- Change Linked Bank
	- [ ] Link bank directly
	- [ ] Search bank
	- [ ] Change linked bank
	- [ ] Keep existing linked bank
	- [ ] Link bank manually
	- [ ] Cancel change linked bank
	- [ ] Incorrect verification code
	- [ ] Correct verification code
	- [ ] Resend code

- Offerings
	- [ ] Create new offering
	- [ ] Generate docs
	- [ ] Edit POC
	- [ ] Data room upload document
	- [ ] Add bonus rewards
	- [ ] Launch offering
	- [ ] Offering Preview
	- [ ] Referral code
	- [ ] Offering closure
	- [ ] Do not upload NPA document, try to invest in such offering

- Invest Now 
	- [ ] Invest for freeze account
	- [X] Invalid user login credentials (Date : **07-04-2018** | By **Vaibhav**)
	- [X] Invest when investor not logged in (Date : **07-04-2018** | By **Vaibhav**)
	- [ ] Invest in partially created account
	- [ ] Investment with multiple account type selection
	- [ ] Accreditation popup for parallel offering (506C and 506B)
	- [X] Invest when accreditation request pending (Date : **07-04-2018** | By **Vaibhav**)
	- [X] Invest below min investment amount (Date : **07-04-2018** | By **Vaibhav**)
	- [ ] Invest above max investment amount
	- [X] Update investment limit (Date : **07-04-2018** | By **Vaibhav**)
	- [ ] Check overdraft amount 
	- [X] Invest successfully in offering `CF Type Offering` (Date : **07-04-2018** | By **Vaibhav**)
	- [ ] Invest successfully in offering `BD_506C Type Offering`
	- [ ] Invest successfully in offering `BD_506B Type Offering`

- Portfolio
	- [ ] View Agreement
	- [ ] Change investment
	- Cancel investment
		- [ ] No, keep investment
		- [ ] Cancel investment

- Issuer Signup
	 - [ ] Prequal Success (Date : **07-05-2018** | By **Pankaj**)
	 - [ ] Prequal with existing email id
	 - [ ] Prequal failed (Date : **07-05-2018** | By **Pankaj**)
	 - [ ] Prequal failed but lendio pass
	 - [ ] Resume Business application and save as draft
	 - [X] Submit business application (Date : **07-04-2018** | By **Pankaj**)

- Account Settings
	- [ ]  Change email
	- [ ] Invalid email
	- [ ] Duplicate email
	- [ ] Change phone
	- [ ] Invalid / Valid code
	- [ ] Change password
	- [ ] Incorrect old password
	- [ ] New password and Confirm new password mismatch

- Accreditation Status
	- [ ] Accreditation: Income verification
	- [ ] Invalid verifier email address
	- [ ] Upload document
	- [ ] Invalid document
	- [ ] Remove uploaded document
	- [ ] Income verification: Net worth verification

- Manage Users
	- [ ] Add new users
	- [ ] Password length
	- [ ] Edit profile data
	- [ ] Login with newly created user
	- [ ] Freeze/Unfreeze account
	- [ ] Soft/Hard delete user profile
	- [ ] Deposit funds

- Accreditation requests
	- [ ] Resend verifier email
	- [ ] Share link
	- [ ] Upload justification document
	- [ ] Upload invalid file name
	- [ ] Remove uploaded document
	- [ ] Approve request
	- [ ] Decline request

- Linked Bank Request
	- [ ] Verify linked bank request

- Crowdpay
	- [ ] Approve request (Review)
	- [ ] Decline request (Review)
	- [ ] GS Process (IRA)
	- [ ] Decline or Validate (IRA)

- Transfer Request
	- [ ] Pending tab (Approve, sync and Decline transactions)
	- [ ] Processing tab (Verify transactions)
	- [ ] Complete tab

- Applications
	- Prequal failed
		- [ ] Promote application
		- [ ] Delete Application
		- [ ] View Application
	- In-Progress
		- [ ] Stash application
		- [ ] Unstash application
		- [ ] Delete Application
		- [ ] View Application
	- Completed
		- [ ] Delete Application
		- View Application
			- Review tab
				- [ ] Save
				- [ ] Submit for approval
				- [ ] Approve/Decline
				- [ ] Generate PA (Offer tab)
				- [ ] Submit offer (Offer tab) 		 

	- Contents
		- Categories
			- [ ] Add category
			- [ ] Delete category
			- [ ] Edit category
		- FAQ
			- [ ] Add faq
			- [ ] Manage categories
			- [ ] Edit faq
			- [ ] Delete faq
			- [ ] Search faq
		- Knowledge Base
			- [ ] New KB article
			- [ ] Delete Knowledge base
			- [ ] Edit knowledge base
			- [ ] Search knowledge base
		- Insights
			- [ ] Add new insights
			- [ ] Delete insights
			- [ ] Edit insights
