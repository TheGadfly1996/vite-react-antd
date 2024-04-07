export default function Login() {
	return (
		<div className='app-container'>
			<div className='login-container'>
				<h1 className='text-3xl font-bold'>Login</h1>
				<form className='flex flex-col gap-4'>
					<label htmlFor='email'>Email</label>
					<input type='email' id='email' />
					<label htmlFor='password'>Password</label>
					<input type='password' id='password' />
					<button type='submit' className='bg-blue-500 text-white py-2 rounded-md'>
						Login
					</button>
				</form>
			</div>
		</div>
	)
}
