from .rest import Rest as _Rest
from .soap import Soap as _Soap
from .restAsync import RestAsync as _RestAsync
from .soapAsync import SoapAsync as _SoapAsync

Rest = _Rest
Soap = _Soap
RestAsync = _RestAsync
SoapAsync = _SoapAsync

__all__ = ['Rest', 'Soap', 'RestAsync', 'SoapAsync']