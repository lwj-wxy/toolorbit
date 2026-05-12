'use client';

import ArchiveConverter from '../views/tools/calculate/ArchiveConverter';
import PpiCalculator from '../views/tools/calculate/PpiCalculator';
import RmbConverter from '../views/tools/calculate/RmbConverter';
import TimeConverter from '../views/tools/calculate/TimeConverter';
import UnitConverter from '../views/tools/calculate/UnitConverter';
import AsciiTable from '../views/tools/dev/AsciiTable';
import Base64 from '../views/tools/dev/Base64';
import BaseConverter from '../views/tools/dev/BaseConverter';
import ChineseCrypto from '../views/tools/dev/ChineseCrypto';
import ChmodCalculator from '../views/tools/dev/ChmodCalculator';
import ColorConverter from '../views/tools/dev/ColorConverter';
import ColorPalette from '../views/tools/dev/ColorPalette';
import ColorPicker from '../views/tools/dev/ColorPicker';
import CryptoSymmetric from '../views/tools/dev/CryptoSymmetric';
import HashGenerator from '../views/tools/dev/HashGenerator';
import HexStringConverter from '../views/tools/dev/HexStringConverter';
import JsonFormatter from '../views/tools/dev/JsonFormatter';
import JsonToTs from '../views/tools/dev/JsonToTs';
import JwtDebugger from '../views/tools/dev/JwtDebugger';
import MorseCode from '../views/tools/dev/MorseCode';
import PasswordGenerator from '../views/tools/dev/PasswordGenerator';
import RegexTester from '../views/tools/dev/RegexTester';
import TextDiff from '../views/tools/dev/TextDiff';
import TimestampConverter from '../views/tools/dev/TimestampConverter';
import UnicodeConverter from '../views/tools/dev/UnicodeConverter';
import UrlEncoder from '../views/tools/dev/UrlEncoder';
import UuidGenerator from '../views/tools/dev/UuidGenerator';
import XmlToJson from '../views/tools/dev/XmlToJson';
import EtsyFee from '../views/tools/ecommerce/EtsyFee';
import StripeFee from '../views/tools/ecommerce/StripeFee';
import Game2048 from '../views/tools/fun/Game2048';
import Minesweeper from '../views/tools/fun/Minesweeper';
import BarcodeGenerator from '../views/tools/image/BarcodeGenerator';
import ImageCompressor from '../views/tools/image/ImageCompressor';
import ImageConverter from '../views/tools/image/ImageConverter';
import ImageCropper from '../views/tools/image/ImageCropper';
import ImageToBase64 from '../views/tools/image/ImageToBase64';
import ImageToIco from '../views/tools/image/ImageToIco';
import QrGenerator from '../views/tools/image/QrGenerator';
import QrScanner from '../views/tools/image/QrScanner';
import SvgToPng from '../views/tools/image/SvgToPng';
import ShortUrl from '../views/tools/net/ShortUrl';
import ImageToPdf from '../views/tools/pdf/ImageToPdf';
import PdfMerge from '../views/tools/pdf/PdfMerge';
import PdfSplit from '../views/tools/pdf/PdfSplit';
import PdfToImage from '../views/tools/pdf/PdfToImage';
import PlaceholderTool from '../views/tools/shared/PlaceholderTool';
import SymbolLibrary from '../views/tools/text/SymbolLibrary';
import TextAnalyzer from '../views/tools/text/TextAnalyzer';
import TextCleaner from '../views/tools/text/TextCleaner';
import CodeReviewer from '../views/tools/ai/CodeReviewer';
import CompetitorTracker from '../views/tools/ai/CompetitorTracker';
import ExcelFormula from '../views/tools/ai/ExcelFormula';
import ImageGenerator from '../views/tools/ai/ImageGenerator';
import KeywordAnalyzer from '../views/tools/ai/KeywordAnalyzer';
import ListingGenerator from '../views/tools/ai/ListingGenerator';
import LogoGenerator from '../views/tools/ai/LogoGenerator';
import MarketInsights from '../views/tools/ai/MarketInsights';
import MeetingMinutes from '../views/tools/ai/MeetingMinutes';
import PromptGenerator from '../views/tools/ai/PromptGenerator';
import RegexGenerator from '../views/tools/ai/RegexGenerator';
import SvgGenerator from '../views/tools/ai/SvgGenerator';
import TextPolisher from '../views/tools/ai/TextPolisher';
import Translator from '../views/tools/ai/Translator';
import VideoScript from '../views/tools/ai/VideoScript';
import WeeklyReport from '../views/tools/ai/WeeklyReport';
import Xiaohongshu from '../views/tools/ai/Xiaohongshu';
import YoutubeGenerator from '../views/tools/ai/YoutubeGenerator';

export const toolComponentMap: Record<string, React.ComponentType> = {
  '/tools/ai/youtube-generator': YoutubeGenerator,
  '/tools/ai/prompt-generator': PromptGenerator,
  '/tools/ai/weekly-report': WeeklyReport,
  '/tools/ai/code-reviewer': CodeReviewer,
  '/tools/ai/video-script': VideoScript,
  '/tools/ai/meeting-minutes': MeetingMinutes,
  '/tools/ai/excel-formula': ExcelFormula,
  '/tools/ai/regex': RegexGenerator,
  '/tools/ai/svg-generator': SvgGenerator,
  '/tools/ai/logo-generator': LogoGenerator,
  '/tools/ai/image-generator': ImageGenerator,
  '/tools/ai/xiaohongshu': Xiaohongshu,
  '/tools/ai/text-polisher': TextPolisher,
  '/tools/ai/translator': Translator,
  '/tools/ai/listing-generator': ListingGenerator,
  '/tools/ai/keyword-analyzer': KeywordAnalyzer,
  '/tools/ai/competitor-tracker': CompetitorTracker,
  '/tools/ai/market-insights': MarketInsights,
  '/tools/calculate/archive-converter': ArchiveConverter,
  '/tools/calculate/ppi-calculator': PpiCalculator,
  '/tools/calculate/rmb-converter': RmbConverter,
  '/tools/calculate/time-converter': TimeConverter,
  '/tools/calculate/unit-converter': UnitConverter,
  '/tools/dev/ascii-table': AsciiTable,
  '/tools/dev/base64': Base64,
  '/tools/dev/base-converter': BaseConverter,
  '/tools/dev/chinese-crypto': ChineseCrypto,
  '/tools/dev/chmod-calculator': ChmodCalculator,
  '/tools/dev/color-converter': ColorConverter,
  '/tools/dev/color-palette': ColorPalette,
  '/tools/dev/color-picker': ColorPicker,
  '/tools/dev/crypto-symmetric': CryptoSymmetric,
  '/tools/dev/hash-generator': HashGenerator,
  '/tools/dev/hex-string-converter': HexStringConverter,
  '/tools/dev/json-formatter': JsonFormatter,
  '/tools/dev/json-to-ts': JsonToTs,
  '/tools/dev/jwt-debugger': JwtDebugger,
  '/tools/dev/morse-code': MorseCode,
  '/tools/dev/password-generator': PasswordGenerator,
  '/tools/dev/regex-tester': RegexTester,
  '/tools/dev/text-diff': TextDiff,
  '/tools/dev/timestamp-converter': TimestampConverter,
  '/tools/dev/unicode-converter': UnicodeConverter,
  '/tools/dev/url-encoder': UrlEncoder,
  '/tools/dev/uuid-generator': UuidGenerator,
  '/tools/dev/xml-to-json': XmlToJson,
  '/tools/ecommerce/etsy-fee-calculator': EtsyFee,
  '/tools/ecommerce/stripe-fee-calculator': StripeFee,
  '/tools/fun/game-2048': Game2048,
  '/tools/fun/minesweeper': Minesweeper,
  '/tools/generator/barcode-generator': BarcodeGenerator,
  '/tools/generator/qr-generator': QrGenerator,
  '/tools/generator/qr-scanner': QrScanner,
  '/tools/image/image-compressor': ImageCompressor,
  '/tools/image/image-converter': ImageConverter,
  '/tools/image/image-cropper': ImageCropper,
  '/tools/image/image-to-base64': ImageToBase64,
  '/tools/image/image-to-ico': ImageToIco,
  '/tools/image/svg-to-png': SvgToPng,
  '/tools/net/short-url': ShortUrl,
  '/tools/pdf/image-to-pdf': ImageToPdf,
  '/tools/pdf/pdf-merge': PdfMerge,
  '/tools/pdf/pdf-split': PdfSplit,
  '/tools/pdf/pdf-to-image': PdfToImage,
  '/tools/shared/placeholder': PlaceholderTool,
  '/tools/text/symbol-library': SymbolLibrary,
  '/tools/text/text-analyzer': TextAnalyzer,
  '/tools/text/text-cleaner': TextCleaner,
};
