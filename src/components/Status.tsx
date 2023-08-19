import { Center, Tooltip, keyframes } from "@chakra-ui/react";

interface Props {
  active: boolean;
}

export const StatusIndicator = ({ active }: Props) => {
  const activeColor = "green.500";
  const inactiveColor = "gray.400";
  const ringScaleMin = 0.33;
  const ringScaleMax = 0.66;

  const pulseRing = keyframes`
	0% {
    transform: scale(${ringScaleMin});
  }
	30% {
		transform: scale(${ringScaleMax});
	}
  40%,
  50% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
	`;

  const pulseDot = keyframes`
	0% {
    transform: scale(0.9);
  }
  25% {
    transform: scale(1.1);
  }
  50% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(0.9);
  }
	`;

  return active ? (
    <Tooltip label="API Status: Active" textTransform="capitalize">
      <Center
        h="1em"
        w="1em"
        mx={1}
        bgColor={activeColor}
        borderRadius="50%"
        _before={{
          bgColor: activeColor,
          animation: `2.25s ${pulseRing} cubic-bezier(0.455, 0.03, 0.515, 0.955) -0.4s infinite`,
        }}
        _after={{
          animation: `2.25s ${pulseDot} cubic-bezier(0.455, 0.03, 0.515, 0.955) -0.4s infinite`,
        }}
      ></Center>
    </Tooltip>
  ) : (
    <Tooltip label="API Status: Inactive" textTransform="capitalize">
      <Center
        h="1em"
        w="1em"
        bgColor={inactiveColor}
        borderRadius="50%"
      ></Center>
    </Tooltip>
  );
};
