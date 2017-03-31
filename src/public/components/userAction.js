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
			avgRating: 3.5,
			bio: "This is some bio. Hello, I am outgoing and will cater to the needs of every student I teach."
		}
	}

	static get dummyMetrics() {
		return  [{
			id: "1001", 
			reviewer: {
				id: "student1",
				firstName: "Minhyuk",
				lastName: "Btob",
				profImage: "http://cfile9.uf.tistory.com/image/241A953B57385E6D288941"
			}, 
			reviewee: {
				id: "something",
				firstName: "First",
				lastName: "Last",
				profImage: "https://organicthemes.com/demo/profile/files/2012/12/profile_img.png"
			}, 
			avgRating: "4.5",
			review: "This is a good review of the teacher.", 
			dateCreated: new Date() 
		}, {
			id: "1002", 
			reviewer: {
				id: "student2",
				firstName: "Eunkwang",
				lastName: "Btob",
				profImage: "https://s-media-cache-ak0.pinimg.com/236x/d0/6a/1e/d06a1ebfcd57db901106ddff09455620.jpg"
			}, 
			reviewee: {
				id: "something",
				firstName: "First",
				lastName: "Last",
				profImage: "https://organicthemes.com/demo/profile/files/2012/12/profile_img.png"
			}, 
			avgRating: "2.0",
			review: "This is a bad review of the teacher. This is a description of why the teacher is bad...", 
			dateCreated: new Date() 
		}]
	}

	static receiveCurrentUser(user) {
		return {
			type: this.CURRENT_USER,
			user
		}
	}


}