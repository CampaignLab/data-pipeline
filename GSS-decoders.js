const gssRegex = /^[a-zA-z]\d{8}/;

const gss = {}
// England, Wales, Scotland and Northern Ireland
gss.E00 =gss.W00	=gss.S00	=gss.N00	= "Census Output Area"
gss.E05	=gss.W05	=gss.S13	=gss.N08	=	"Ward or Electoral Division "
gss.E14	=gss.W07	=gss.S14	=gss.N06	=	"Westminster Parliamentary Constituency"
gss.E15	=gss.W08	=gss.S15	=gss.N07	=	"European Electoral Region"
gss.E23	=gss.W15	=gss.S23	=gss.N23	=	"Police Force Areas"
gss.E33	=gss.W35	=gss.S34	=gss.N19	=	"Workplace Zones"
gss.E92	=gss.W92	=gss.S92	=gss.N92	=	"Country"
gss.E30	=gss.W22	=gss.S22	=gss.N12	=gss.K01 = "Travel to Work Areas"
// overrides
                             gss.N00	= "Small Areas"

// England, Wales, Scotland
gss.E01	=gss.W01	=gss.S01 =	"Lower layer Super Output Area (LSOA)"
gss.E02	=gss.W02	=gss.S02 =	"Middle layer Super Output Area (MSOA)"
gss.E04  =gss.W04  =gss.S35 =	"Civil Parish"
gss.E32	=gss.W09	=gss.S16 =	"London Assembly; Welsh Assembly; Scottish parliament constituency"
gss.E26	=gss.W18	=gss.S21 =	"National Park "
gss.E06	=gss.W06	=gss.S12 =	"Unitary Authority"
           gss.W10	=gss.S17 =	"Welsh / Scottish Electoral Region"
// overrides
           gss.W10           =	"Welsh Assemblyt Electoral Region"
                     gss.S17 =	"Scottish Parliament Electoral Region"
           gss.W04           =  "Community"
                     gss.S01 = 	"Data Zone"
                     gss.S02 = 	"Intermediate Zone"

// England & Wales
gss.E34	=gss.W37	=gss.K05 =  "Built Up Areas"
gss.E35	=gss.W38  =gss.K06 =  "Built Up Area Sub-Divisions"


// England
gss.E07	=	"Non-Metropolitan District (two-tier)"
gss.E08	=	"Metropolitan Borough"
gss.E09	=	"London Borough"
gss.E10	=	"County"
gss.E11	=	"Metropolitan County"
gss.E12	=	"English Region"
gss.E38	=	"Clinical Commissioning Groups"

gss.E18	=gss.L00 =gss.M00 =	"Strategic Health Authorities"

//Wales
gss.W03	= "Upper layer Super Output Area (USOA)"

// Northern Ireland
gss.N24	= "Police Force Districts"



isGssCode = code => {
  return startsWithGssCode (code) && code.length==9
}

startsWithGssCode = code => {
  return (typeof code === string) && gss[code.slice(0,3)]
}

whatIs = code => {
  return startsWithGssCode (code)?
    gss[code.slice(0,3)]
  : null
}

module.exports = {isGssCode, startsWithGssCode, whatIs}
