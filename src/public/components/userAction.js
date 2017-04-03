import axios from 'axios';

export default class userAction {
	static get CURRENT_AVG_RATING() { return 'CURRENT_AVG_RATING' };
	static get AVG_RATING() { return 'AVG_RATING' };
	static get CURRENT_USER() { return 'CURRENT_USER' };
	static get RECEIVE_USER() { return 'RECEIVE_USER' };
	static get SEARCH_CRITERIA() { return 'SEARCH_CRITERIA' };
	static get USER_LIST() { return 'USER_LIST' };
	static get METRIC_LIST() { return 'METRIC_LIST' };

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

	static get dummyList() {
		return [{
			id: "something",
			lastName: "Last",
			firstName: "First",
			mLocation: "Vancouver",
			instruments: [{
				instr: "Piano",
				cert: "RCMlv5",
				qproof: "https://images.sampletemplates.com/wp-content/uploads/2015/08/Restaurant-Menu-Template-PDF-Download.jpg"
			}],
			verify: true,
			profImage: "https://organicthemes.com/demo/profile/files/2012/12/profile_img.png",
			hrRate: 20.55,
			bio: "This is some bio. Hello, I am outgoing and will cater to the needs of every student I teach."
		}, {
			id: "something1",
			lastName: "Chloe",
			firstName: "Cat",
			mLocation: "Vancouver",
			instruments: [{
				instr: "Piano",
				cert: "RCMlv5",
				qproof: "https://images.sampletemplates.com/wp-content/uploads/2015/08/Restaurant-Menu-Template-PDF-Download.jpg"
			}],
			verify: true,
			profImage: "https://cdn.pixabay.com/photo/2014/03/29/09/17/cat-300572_960_720.jpg",
			hrRate: 40.99,
			bio: "Meow.. Meow. Meow Meow Meow.. Meow.. Meow Meow.. Meow. Nyaaaaaaaaa.. "
		}, {
			id: "something2",
			lastName: "Bacon",
			firstName: "Chris P.",
			mLocation: "Vancouver",
			instruments: [{
				instr: "Piano",
				cert: "RCMlv5",
				qproof: "https://images.sampletemplates.com/wp-content/uploads/2015/08/Restaurant-Menu-Template-PDF-Download.jpg"
			}],
			verify: false,
			profImage: "http://www.dppigs.org/2018/images/pig.png",
			hrRate: 50.20,
			bio: "Who said breakfast?"
		}, {
			id: "something3",
			lastName: "Teacher",
			firstName: "A",
			mLocation: "Vancouver",
			instruments: [{
				instr: "Piano",
				cert: "RCMlv5",
				qproof: "https://images.sampletemplates.com/wp-content/uploads/2015/08/Restaurant-Menu-Template-PDF-Download.jpg"
			}],
			verify: false,
			profImage: "https://s-media-cache-ak0.pinimg.com/736x/40/32/e0/4032e0031e2e95989f1e76fe3d4f57b7.jpg",
			hrRate: 50.20,
			bio: "I am a wannabe teacher. LUL"
		}, {
			id: "something4",
			lastName: "Teacher",
			firstName: "Trashy",
			mLocation: "Vancouver",
			instruments: [{
				instr: "Piano",
				cert: "RCMlv5",
				qproof: "https://images.sampletemplates.com/wp-content/uploads/2015/08/Restaurant-Menu-Template-PDF-Download.jpg"
			}],
			verify: false,
			profImage: "https://s-media-cache-ak0.pinimg.com/736x/3d/88/98/3d8898d3378e879a19e668f2fc33fb28.jpg",
			hrRate: 50.20,
			bio: "I am a trashy teacher. Need I say more?"
		}]
	}

	static receiveCurrentUser(user) {
		return {
			type: this.CURRENT_USER,
			user
		}
	}

	static receiveUser(user) {
		return {
			type: this.RECEIVE_USER,
			user
		}
	}

	static receiveCurrentAvgRating(avgRating) {
		return {
			type: this.CURRENT_AVG_RATING,
			avgRating
		}
	}

	static receiveAvgRating(avgRating) {
		return {
			type: this.AVG_RATING,
			avgRating
		}
	}

	static receiveSearchCriteria(criteria) {
		return {
			type: this.SEARCH_CRITERIA,
			criteria
		}
	}

	static receiveUsers(users) {
		return{
			type: this.USER_LIST,
			users
		}
	}

	static receiveMetrics(metrics) {
		return {
			type: this.METRIC_LIST,
			metrics
		}
	}

	static getUsers(criteria) {
		const that = this;
		return dispatch => {
			dispatch(that.receiveSearchCriteria(criteria));
			dispatch(that.receiveUsers(that.dummyList)); // dispatch(that.receiveUsers(undefined));
			return axios.get('/api/users', criteria).then((data) => dispatch(that.receiveUsers(data)));
		}
	}

	static getUser(userId, isCurrentUser) {
		const that = this;
		return dispatch => {
			dispatch(that.receiveUser(undefined));
			return axios.get('/api/user', { userId })
				.then((data) => {
					isCurrentUser? dispatch(that.receiveCurrentUser(data)) : dispatch(that.receiveUser(data));
					dispatch(that.getMetrics(userId, 1 == data.status, isCurrentUser));
				});
		}
	}

	static getMetrics(userId, isTeacher, isCurrentUser) {
		const that = this;
		const option = isTeacher ? { revieweeId: userId } : { reviewerId: userId };
		return dispatch => {
			dispatch(that.receiveMetrics([]));
			isCurrentUser ? 
				dispatch(that.receiveCurrentAvgRating(undefined)) : 
				dispatch(that.receiveAvgRating(undefined));
			return axios.get('/api/metric', option)
				.then((data) => {
					dispatch(that.receiveMetrics(data.metrics));
					isCurrentUser ? 
						dispatch(that.receiveCurrentAvgRating(data.avgRating)) : 
						dispatch(that.receiveAvgRating(data.avgRating));
				});
		}
	}

	static login(user) {
		const that = this;
		return dispatch => {
			return axios.get('/api/login', { params: user })
				.then((response) => dispatch(that.receiveCurrentUser(response.data.data)));
		}
	}

	static updateTeacher(user) {
		const that = this;
		return dispatch => {
			return axios.post('/api/user1');
		}
	}

	static updateStudent(user) {
		const that = this;
		return dispatch => {
			return axios.post('/api/user2');
		}
	}
}