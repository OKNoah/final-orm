EventEmitter = require('ui-js/core/event-emitter')

props = 'alignContent alignItems alignSelf alignmentBaseline all animation animationDelay animationDirection animationDuration animationFillMode animationIterationCount animationName animationPlayState animationTimingFunction backfaceVisibility background backgroundAttachment backgroundBlendMode backgroundClip backgroundColor backgroundImage backgroundOrigin backgroundPosition backgroundPositionX backgroundPositionY backgroundRepeat backgroundRepeatX backgroundRepeatY backgroundSize baselineShift border borderBottom borderBottomColor borderBottomLeftRadius borderBottomRightRadius borderBottomStyle borderBottomWidth borderCollapse borderColor borderImage borderImageOutset borderImageRepeat borderImageSlice borderImageSource borderImageWidth borderLeft borderLeftColor borderLeftStyle borderLeftWidth borderRadius borderRight borderRightColor borderRightStyle borderRightWidth borderSpacing borderStyle borderTop borderTopColor borderTopLeftRadius borderTopRightRadius borderTopStyle borderTopWidth borderWidth bottom boxShadow boxSizing bufferedRendering captionSide clear clip clipPath clipRule color colorInterpolation colorInterpolationFilters colorRendering content counterIncrement counterReset cssFloat cssText cursor cx cy direction display dominantBaseline emptyCells fill fillOpacity fillRule filter flex flexBasis flexDirection flexFlow flexGrow flexShrink flexWrap float floodColor floodOpacity font fontFamily fontFeatureSettings fontKerning fontSize fontStretch fontStyle fontVariant fontVariantLigatures fontWeight height imageRendering isolation justifyContent left letterSpacing lightingColor lineHeight listStyle listStyleImage listStylePosition listStyleType margin marginBottom marginLeft marginRight marginTop marker markerEnd markerMid markerStart mask maskType maxHeight maxWidth maxZoom minHeight minWidth minZoom mixBlendMode motion motionOffset motionPath motionRotation objectFit objectPosition opacity order orientation orphans outline outlineColor outlineOffset outlineStyle outlineWidth overflow overflowWrap overflowX overflowY padding paddingBottom paddingLeft paddingRight paddingTop page pageBreakAfter pageBreakBefore pageBreakInside paintOrder perspective perspectiveOrigin pointerEvents position quotes r resize right rx ry shapeImageThreshold shapeMargin shapeOutside shapeRendering size speak src stopColor stopOpacity stroke strokeDasharray strokeDashoffset strokeLinecap strokeLinejoin strokeMiterlimit strokeOpacity strokeWidth tabSize tableLayout textAlign textAlignLast textAnchor textCombineUpright textDecoration textIndent textOrientation textOverflow textRendering textShadow textTransform top touchAction transform transformOrigin transformStyle transition transitionDelay transitionDuration transitionProperty transitionTimingFunction unicodeBidi unicodeRange userZoom vectorEffect verticalAlign visibility whiteSpace widows width willChange wordBreak wordSpacing wordWrap writingMode x y zIndex zoom'.split(/\s+/)

cssProps = props.map (prop)->
	prop.replace /[A-Z]/mg, (letter)->
		"-#{letter.toLowerCase()}"


module.exports = class Style extends EventEmitter


	for prop in props then do (prop)=>
		privateProp = "_#{prop}"
		Object.defineProperty @prototype, prop,
			configurable: on
			enumerable: on
			set: (value)->
				value = value + ''
				@[privateProp] = value
				@node.mutate (mutation)-> mutation.changeStyle(prop)
				return value
			get: -> @[privateProp] ? ''


	constructor: (@node)->
		super
		return


	toString: ->
		string = ''
		for prop, index in props
			value = @[prop]
			unless value then continue
			cssProp = cssProps[index]
			string += "#{cssProp}: #{value};"
		return string



