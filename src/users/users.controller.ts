@Get('me/pincode-status')
@UseGuards(JwtAuthGuard)
async getPincodeStatus(@Request() req) {
  return this.pincodeService.checkExpiration(req.user.id);
}

@Post('me/refresh-pincode')
@UseGuards(JwtAuthGuard)
async refreshPincode(
  @Request() req,
  @Body() { currentPincode, newPincode }
) {
  const isValid = await this.pincodeService.verifyPincode(
    req.user.id, 
    currentPincode
  );
  
  if (!isValid) throw new UnauthorizedException('Invalid current pincode');
  
  return this.pincodeService.setPincode(req.user.id, newPincode);
} 