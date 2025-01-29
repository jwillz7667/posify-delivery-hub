@Post('verify-pincode')
@UseGuards(JwtAuthGuard)
async verifyPincode(
  @Body() { pincode }: VerifyPincodeDto,
  @Headers('authorization') authHeader: string
) {
  const token = authHeader.replace('Bearer ', '');
  const payload = this.jwtService.decode(token);
  
  const isValid = await this.pincodeService.verifyPincode(payload.sub, pincode);
  
  if (!isValid) {
    throw new UnauthorizedException('Invalid pincode');
  }

  return {
    access_token: this.jwtService.sign({
      ...payload,
      pincodeVerified: true
    })
  };
}

@Post('login')
async login(@Body() loginDto: LoginDto) {
  const user = await this.authService.validateUser(
    loginDto.email, 
    loginDto.password
  );
  
  if (!user) {
    throw new UnauthorizedException('Invalid credentials');
  }

  // Return temporary token for pincode verification
  const tempToken = this.jwtService.sign({
    sub: user.id,
    email: user.email,
    role: user.role,
    pincodeRequired: user.pincodeRequired
  });

  return {
    requiresPincode: user.pincodeRequired,
    tempToken
  };
} 