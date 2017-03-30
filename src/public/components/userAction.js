import axios from 'axios';

export default class userAction {
	static get CURRENT_USER() { return 'CURRENT_USER' };

	static get dummyUser() {
		return {
			id: "something",
			lastName: "Last",
			firstName: "First",
			status: 1,
			mLocation: "Vancouver",
			instruments: [{
				instr: "Piano",
				cert: "RCMlv5",
				qproof: "https://images.sampletemplates.com/wp-content/uploads/2015/08/Restaurant-Menu-Template-PDF-Download.jpg"
			}],
			verify: true,
			profImage: "https://organicthemes.com/demo/profile/files/2012/12/profile_img.png",
			hrRate: 20.55,
			bio: ""
		}
	}

	static receiveCurrentUser(user) {
		return {
			type: this.CURRENT_USER,
			user
		}
	}


}