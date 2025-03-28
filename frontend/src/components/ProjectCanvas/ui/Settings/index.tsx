import Konva from "konva";
import { NodeConfig, Node } from "konva/lib/Node";
import { ActionIcon, CloseButton, Divider, Group, Image, Box, Title, Stack, Button, SegmentedControl } from "@mantine/core";
import { useDisclosure, useFullscreen } from "@mantine/hooks";
import ChevronLeftIcon from "@assets/icons/chevron-left.svg";
import ZoomToFitIcon from "@assets/icons/zoomToFit.svg";
import FullScreenIcon from "@assets/icons/fullScreen.svg";
import CropIcon from "@assets/icons/crop.svg";
import PerspectiveIcon from "@assets/icons/perspective.svg";
import FullScreenMinimizeIcon from "@assets/icons/fullScreenMinimize.svg";
import DownloadIcon from "@assets/icons/download.svg";
import { downloadURI, zoomToFit } from "@shared/utils";
import { useProjectStore } from "@shared/store";
import { generateProjectImage } from "@shared/utils/image";
import { CropStatus } from "@shared/types";
import { ImageSettings } from "./ImageSettings";
import { Layers } from "./Layers";
import cx from "clsx";
import theme from "@/theme.module.scss";
import styles from "./settings.module.scss";

type SettingsPropsType = {
    selectedImage: Node<NodeConfig> | null
    setSelectedImage: (val: Node<NodeConfig> | null) => void
    cropStatus: CropStatus | null
    setCropStatus: (val: CropStatus | null) => void
    stage: Konva.Stage
};

export const Settings = ({ selectedImage, stage, setSelectedImage, cropStatus, setCropStatus }: SettingsPropsType) => {
    const [opened, { toggle, close }] = useDisclosure(true);
    const { toggle: toggleFullScreen, fullscreen } = useFullscreen();
    const { title, content } = useProjectStore();
    const processedTitle = selectedImage?.attrs ? selectedImage?.attrs.name || "Object" : "";
    const isCropTypeSelected = cropStatus ? ["in", "out"].includes(cropStatus) : false;

    return (
        <Box
            onKeyDown={(e) => e.stopPropagation()}
            className={opened ? styles.settings : cx(styles.settings, styles.collapsed)}
        >
            <Group
                p="sm"
                justify="space-between"
                wrap="nowrap"
                gap={0}
            >
                <Title title={processedTitle} className={styles.title} size="md">{processedTitle}</Title>
                <CloseButton onClick={close} />
            </Group>
            <Divider />
            <Stack gap={0} className={styles.wrapper}>
                <ActionIcon
                    onClick={toggle}
                    className={styles.openButton}
                    variant="white"
                >
                    <Image src={ChevronLeftIcon} />
                </ActionIcon>
                {selectedImage && (
                    <>
                        <ImageSettings selectedImage={selectedImage} />
                        <Group w="100%" p="xs" wrap="nowrap" gap="xs" justify="center">
                            <Button
                                size="xs"
                                variant="outline"
                                color={cropStatus ? theme.primary : theme.dark}
                                leftSection={<Image src={CropIcon} />}
                                onClick={() => !cropStatus ? selectedImage && setCropStatus("started") : setCropStatus(null)}
                            >
                                Crop
                            </Button>
                            <Button
                                size="xs"
                                variant="outline"
                                leftSection={<Image src={PerspectiveIcon} />}
                                disabled
                            >
                                Perspective
                            </Button>
                        </Group>
                        {cropStatus && (
                            <Stack gap="xs" align="center" p="xs" pt={0}>
                                <SegmentedControl
                                    radius="md"
                                    size="xs"
                                    w={"100%"}
                                    data={[{ label: "Inside", value: "in" }, { label: "Outside", value: "out" }]}
                                    onChange={(val) => setCropStatus(val as CropStatus)}
                                    disabled={cropStatus === "started"}
                                />
                                <Group w="100%" wrap="nowrap" gap="xs">
                                    <Button
                                        size="xs"
                                        variant="outline"
                                        loading={cropStatus === "accept"}
                                        color={theme.primary}
                                        onClick={() => setCropStatus("accept")}
                                        flex={1}
                                        disabled={!isCropTypeSelected}
                                    >
                                        Apply
                                    </Button>
                                    <Button
                                        size="xs"
                                        variant="outline"
                                        color={theme.danger}
                                        onClick={() => setCropStatus(null)}
                                        flex={1}
                                    >
                                        Cancel
                                    </Button>
                                </Group>
                            </Stack>
                        )}
                        <Divider />
                    </>
                )}
                <Layers selectedImage={selectedImage} stage={stage} setSelectedImage={setSelectedImage} />
                <Divider label={"Tools"} />
                <Group p="sm" pt={0}>
                    <ActionIcon
                        size="sm"
                        title="Zoom to fit"
                        variant="white"
                        onClick={() => zoomToFit({ stage })}
                    >
                        <Image src={ZoomToFitIcon} />
                    </ActionIcon>
                    <ActionIcon
                        size="sm"
                        title={fullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                        variant="white"
                        onClick={toggleFullScreen}
                    >
                        <Image src={fullscreen ? FullScreenMinimizeIcon : FullScreenIcon} />
                    </ActionIcon>
                    <ActionIcon
                        size="sm"
                        title={`${title}.png (FullHD)`}
                        variant="white"
                        onClick={async () => {
                            const img = await generateProjectImage(content, { width: 1920, height: 1080 });
                            downloadURI(img, title);
                        }}
                    >
                        <Image src={DownloadIcon} />
                    </ActionIcon>
                </Group>
            </Stack>
        </Box>
    )
}